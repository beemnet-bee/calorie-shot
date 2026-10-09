"use client";

import type { ComponentType } from "react";
import {
  BowlIcon,
  FlatbreadIcon,
  StewIcon,
  MeatPiecesIcon,
  MincedMeatIcon,
  ShreddedIcon,
  LentilsIcon,
  GreensIcon,
  MixedVegIcon,
  PlatterIcon,
  RiceIcon,
  ChickenIcon,
  PastaIcon,
  BeefIcon,
  SaladIcon,
  BroccoliIcon,
  SauceIcon,
  AvocadoIcon,
  BananaIcon,
  AppleIcon,
  EggIcon,
  BreadIcon,
  FishIcon,
  DairyIcon,
  OatmealIcon,
  FriesIcon,
  CheeseIcon,
  OilIcon,
  CoffeeIcon,
  DoughIcon,
  GrainIcon,
  DrinkIcon,
  BreakfastIcon,
  LunchIcon,
  DinnerIcon,
  SnackIcon,
} from "./icons";

type IconComp = ComponentType<{ size?: number; className?: string }>;

// Map icon key (string) → component
export const ICON_BY_KEY: Record<string, IconComp> = {
  flatbread: FlatbreadIcon,
  stew: StewIcon,
  "meat-pieces": MeatPiecesIcon,
  "minced-meat": MincedMeatIcon,
  shredded: ShreddedIcon,
  lentils: LentilsIcon,
  greens: GreensIcon,
  "mixed-veg": MixedVegIcon,
  platter: PlatterIcon,
  dough: DoughIcon,
  grain: GrainIcon,
  drink: DrinkIcon,
  rice: RiceIcon,
  chicken: ChickenIcon,
  pasta: PastaIcon,
  beef: BeefIcon,
  salad: SaladIcon,
  broccoli: BroccoliIcon,
  sauce: SauceIcon,
  avocado: AvocadoIcon,
  banana: BananaIcon,
  apple: AppleIcon,
  egg: EggIcon,
  bread: BreadIcon,
  fish: FishIcon,
  dairy: DairyIcon,
  oatmeal: OatmealIcon,
  fries: FriesIcon,
  cheese: CheeseIcon,
  oil: OilIcon,
  coffee: CoffeeIcon,
  bowl: BowlIcon,
  breakfast: BreakfastIcon,
  lunch: LunchIcon,
  dinner: DinnerIcon,
  snack: SnackIcon,
};

export function FoodIconByKey({
  iconKey,
  size = 28,
  className = "",
}: {
  iconKey: string;
  size?: number;
  className?: string;
}) {
  const Comp = ICON_BY_KEY[iconKey] ?? BowlIcon;
  return <Comp size={size} className={className} />;
}
