"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalorieShot, makeId, type Meal, type FoodItem } from "./provider";
import { Button } from "./button";
import { Card } from "./card";
import { compressImage } from "@/lib/image-utils";
import { inferMealType } from "@/lib/nutrition-utils";
import { AnalysisAnimation } from "./analysis-animation";
import { ResultsView } from "./results-view";
import {
  ScanIcon,
  CameraIcon,
  UploadIcon,
  RefreshIcon,
  SparkleIcon,
  PencilIcon,
} from "./icons";
import { ManualEntryView } from "./manual-entry-view";

type Stage = "capture" | "preview" | "analyzing" | "results" | "manual";

interface AnalyzeResponse {
  result: {
    mealName: string;
    mealEmoji: string;
    mealType: string;
    foods: any[];
    overallConfidence: number;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalFiber: number;
    totalSugar: number;
    totalSodium: number;
    totalSaturatedFat: number;
    totalCholesterol: number;
  };
}

export function ScanPage() {
  const { navigate, pushToast, online, saveMeal } = useCalorieShot();
  const [stage, setStage] = useState<Stage>("capture");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageThumb, setImageThumb] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponse["result"] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch (e: any) {
      setCameraError(
        e?.name === "NotAllowedError"
          ? "Camera permission denied. You can upload a photo instead."
          : "Could not open camera. Try uploading instead."
      );
    }
  }, []);

  const captureFromCamera = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      stopCamera();
      await handleFile(blob);
    }, "image/jpeg", 0.9);
  }, [stopCamera]);

  const handleFile = useCallback(async (file: File | Blob) => {
    setError(null);
    try {
      const { dataUrl, thumb } = await compressImage(file);
      setImageDataUrl(dataUrl);
      setImageThumb(thumb);
      setStage("preview");
    } catch (e: any) {
      setError("Could not process the image. Try another one.");
      pushToast({ title: "Image error", description: "Could not process image", variant: "error" });
    }
  }, [pushToast]);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = "";
    },
    [handleFile]
  );

  const runAnalysis = useCallback(async () => {
    if (!imageDataUrl) return;
    if (!online) {
      pushToast({
        title: "You're offline",
        description: "AI scanning requires an internet connection. Saved meals are still available.",
        variant: "error",
      });
      return;
    }
    setAnalyzing(true);
    setError(null);
    setStage("analyzing");
    try {
      const res = await fetch("/api/analyze-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Analysis failed");
      }
      const data: AnalyzeResponse = await res.json();
      setAnalysisResult(data.result);
      setStage("results");
    } catch (e: any) {
      setError(e?.message || "Analysis failed");
      setStage("preview");
      pushToast({ title: "Analysis failed", description: e?.message, variant: "error" });
    } finally {
      setAnalyzing(false);
    }
  }, [imageDataUrl, online, pushToast]);

  const handleSave = useCallback(
    async (foods: FoodItem[], mealName: string, mealEmoji: string, mealType: Meal["mealType"], userConfirmed: boolean) => {
      const totals = (k: keyof FoodItem) =>
        foods.reduce((a, f) => a + (f[k] as number), 0);

      const meal: Meal = {
        id: makeId("meal"),
        name: mealName,
        emoji: mealEmoji,
        imageDataUrl: imageDataUrl ?? undefined,
        imageThumb: imageThumb ?? undefined,
        foods,
        totalCalories: Math.round(totals("calories")),
        totalProtein: Math.round(totals("protein") * 10) / 10,
        totalCarbs: Math.round(totals("carbs") * 10) / 10,
        totalFat: Math.round(totals("fat") * 10) / 10,
        totalFiber: Math.round(totals("fiber") * 10) / 10,
        totalSugar: Math.round(totals("sugar") * 10) / 10,
        totalSodium: Math.round(totals("sodium")),
        totalSaturatedFat: Math.round(totals("saturatedFat") * 10) / 10,
        totalCholesterol: Math.round(totals("cholesterol")),
        loggedAt: Date.now(),
        mealType,
        userConfirmed,
      };
      await saveMeal(meal);
      pushToast({
        title: "Meal saved",
        description: `${meal.name} · ${meal.totalCalories} kcal`,
        variant: "success",
      });
      setStage("capture");
      setImageDataUrl(null);
      setImageThumb(null);
      setAnalysisResult(null);
      navigate("home");
    },
    [imageDataUrl, imageThumb, saveMeal, pushToast, navigate]
  );

  // Save handler for manual entries (no image) — accepts optional loggedAt for past-date entries
  const handleManualSave = useCallback(
    async (foods: FoodItem[], mealName: string, mealEmoji: string, mealType: Meal["mealType"], userConfirmed: boolean, loggedAt?: number) => {
      const totals = (k: keyof FoodItem) =>
        foods.reduce((a, f) => a + (f[k] as number), 0);

      const meal: Meal = {
        id: makeId("meal"),
        name: mealName,
        emoji: mealEmoji,
        foods,
        totalCalories: Math.round(totals("calories")),
        totalProtein: Math.round(totals("protein") * 10) / 10,
        totalCarbs: Math.round(totals("carbs") * 10) / 10,
        totalFat: Math.round(totals("fat") * 10) / 10,
        totalFiber: Math.round(totals("fiber") * 10) / 10,
        totalSugar: Math.round(totals("sugar") * 10) / 10,
        totalSodium: Math.round(totals("sodium")),
        totalSaturatedFat: Math.round(totals("saturatedFat") * 10) / 10,
        totalCholesterol: Math.round(totals("cholesterol")),
        loggedAt: loggedAt ?? Date.now(),
        mealType,
        userConfirmed,
      };
      await saveMeal(meal);
      pushToast({
        title: "Meal saved",
        description: `${meal.name} · ${meal.totalCalories} kcal`,
        variant: "success",
      });
      setStage("capture");
      navigate("home");
    },
    [saveMeal, pushToast, navigate]
  );

  return (
    <div className="px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-32 lg:pb-12 max-w-2xl lg:max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight"><span className="text-gradient">Scan</span> Meal</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Snap it. Know it. Track it.</p>
        </div>
        {stage !== "capture" ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              stopCamera();
              setStage("capture");
              setImageDataUrl(null);
              setImageThumb(null);
              setAnalysisResult(null);
              setError(null);
            }}
          >
            Reset
          </Button>
        ) : null}
      </div>

      <AnimatePresence mode="wait">
        {stage === "capture" && (
          <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
            <CaptureStage
              videoRef={videoRef}
              cameraActive={cameraActive}
              cameraError={cameraError}
              online={online}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onCapture={captureFromCamera}
              onUploadClick={() => fileInputRef.current?.click()}
              onCameraClick={() => cameraInputRef.current?.click()}
              onManualClick={() => setStage("manual")}
            />
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={onFileChange} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={onFileChange} />
          </motion.div>
        )}

        {stage === "preview" && imageDataUrl && (
          <motion.div key="preview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <PreviewStage
              imageDataUrl={imageDataUrl}
              online={online}
              error={error}
              onRetake={() => {
                setImageDataUrl(null);
                setImageThumb(null);
                setError(null);
                setStage("capture");
              }}
              onAnalyze={runAnalysis}
              analyzing={analyzing}
            />
          </motion.div>
        )}

        {stage === "analyzing" && imageDataUrl && (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalysisAnimation imageDataUrl={imageDataUrl} />
          </motion.div>
        )}

        {stage === "results" && analysisResult && (
          <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ResultsView result={analysisResult} imageDataUrl={imageDataUrl ?? undefined} onSave={handleSave} />
          </motion.div>
        )}

        {stage === "manual" && (
          <motion.div key="manual" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ManualEntryView onSave={handleManualSave} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============================================
// Capture Stage
// =============================================
function CaptureStage({
  videoRef,
  cameraActive,
  cameraError,
  online,
  onStartCamera,
  onStopCamera,
  onCapture,
  onUploadClick,
  onCameraClick,
  onManualClick,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraActive: boolean;
  cameraError: string | null;
  online: boolean;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onCapture: () => void;
  onUploadClick: () => void;
  onCameraClick: () => void;
  onManualClick: () => void;
}) {
  return (
    <div>
      <div className="relative aspect-[3/4] w-full r-xl overflow-hidden glass">
        {cameraActive ? (
          <video ref={videoRef} playsInline muted autoPlay className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-grid">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-24 h-24 rounded-full bg-brand-gradient grid place-items-center mb-5 shadow-glow-strong text-white"
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full"
                animate={{ boxShadow: ["0 0 0 0 color-mix(in oklab, var(--brand-2) 50%, transparent)", "0 0 0 24px color-mix(in oklab, var(--brand-2) 0%, transparent)"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
              <ScanIcon size={36} />
            </motion.div>
            <h3 className="text-base font-semibold">Take or upload a meal photo</h3>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-[260px]">
              <span className="text-gradient font-semibold">CalorieShot AI</span> will identify your food and estimate nutrition automatically.
            </p>
            {cameraError ? (
              <p className="mt-3 text-xs text-[color:var(--destructive)] max-w-[280px]">{cameraError}</p>
            ) : null}
            {!online ? (
              <p className="mt-3 text-xs text-[color:var(--destructive)] max-w-[280px]">
                You&apos;re offline. AI scanning requires an internet connection.
              </p>
            ) : null}
          </div>
        )}

        {cameraActive ? (
          <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-center gap-4 bg-gradient-to-t from-black/70 to-transparent">
            <button onClick={onStopCamera} className="text-white/90 text-xs font-medium">Cancel</button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onCapture}
              className="w-[68px] h-[68px] rounded-full bg-white grid place-items-center shadow-glow"
              aria-label="Take photo"
            >
              <div className="w-12 h-12 rounded-full bg-brand-gradient" />
            </motion.button>
            <button onClick={onUploadClick} className="text-white/90" aria-label="Upload">
              <UploadIcon size={22} />
            </button>
          </div>
        ) : null}
      </div>

      {!cameraActive ? (
        <div className="mt-4 grid gap-2">
          <Button size="lg" fullWidth onClick={onStartCamera}>
            <CameraIcon size={20} />
            Open camera
          </Button>
          <Button size="lg" variant="glass" fullWidth onClick={onUploadClick}>
            <UploadIcon size={20} />
            Upload from gallery
          </Button>
          <button
            onClick={onManualClick}
            className="mt-2 text-xs text-muted-foreground hover:text-[color:var(--brand-2)] transition-colors inline-flex items-center justify-center gap-1.5 py-1"
          >
            <PencilIcon size={14} />
            Or log a meal manually — no photo needed
          </button>
        </div>
      ) : null}

      <button onClick={onCameraClick} className="sr-only">Use system camera</button>
    </div>
  );
}

// =============================================
// Preview Stage
// =============================================
function PreviewStage({
  imageDataUrl,
  online,
  error,
  onRetake,
  onAnalyze,
  analyzing,
}: {
  imageDataUrl: string;
  online: boolean;
  error: string | null;
  onRetake: () => void;
  onAnalyze: () => void;
  analyzing: boolean;
}) {
  return (
    <div>
      <Card padded={false} className="overflow-hidden">
        <div className="relative">
          <img src={imageDataUrl} alt="Meal preview" className="w-full aspect-[3/4] object-cover" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gradient opacity-30 blur-3xl rounded-full pointer-events-none" />
        </div>
      </Card>

      {error ? (
        <Card className="mt-3 border-[color:var(--destructive)]/40 bg-[color:var(--destructive)]/10">
          <p className="text-sm text-[color:var(--destructive)]">{error}</p>
        </Card>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button variant="glass" size="lg" onClick={onRetake} disabled={analyzing}>
          <RefreshIcon size={18} />
          Retake
        </Button>
        <Button size="lg" onClick={onAnalyze} loading={analyzing} disabled={!online}>
          {!analyzing ? (
            <>
              <SparkleIcon size={18} />
              Analyze
            </>
          ) : (
            "Analyzing"
          )}
        </Button>
      </div>
      {!online ? (
        <p className="mt-3 text-xs text-center text-muted-foreground">
          You&apos;re offline. AI scanning requires an internet connection.
        </p>
      ) : null}
    </div>
  );
}
