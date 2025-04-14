
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Atom, Search, Info, Beaker, Database, Filter, ArrowUpDown, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Element {
  atomic_number: number;
  symbol: string;
  name: string;
  atomic_mass: number;
  electron_configuration: string;
  electronegativity: number;
  atomic_radius: number;
  ionization_energy: number;
  group: number;
  period: number;
  block: string;
  category: string;
  density: number;
  melting_point: number;
  boiling_point: number;
  oxidation_states: string;
  electron_configuration_semantic: string;
  discovery_year: number;
  phase: string;
  shells: number[];
}

// Categories and their colors
const categoryColors: { [key: string]: string } = {
  "noble gas": "bg-purple-500",
  "alkali metal": "bg-red-500",
  "alkaline earth metal": "bg-orange-500",
  "transition metal": "bg-yellow-500",
  "post-transition metal": "bg-emerald-500", 
  "metalloid": "bg-teal-500",
  "polyatomic nonmetal": "bg-green-500",
  "diatomic nonmetal": "bg-blue-500",
  "lanthanide": "bg-indigo-500",
  "actinide": "bg-pink-500",
  "unknown": "bg-gray-500",
};

// Text colors for elements
const textColors: { [key: string]: string } = {
  "noble gas": "text-purple-800 dark:text-purple-300",
  "alkali metal": "text-red-800 dark:text-red-300",
  "alkaline earth metal": "text-orange-800 dark:text-orange-300",
  "transition metal": "text-yellow-800 dark:text-yellow-300",
  "post-transition metal": "text-emerald-800 dark:text-emerald-300",
  "metalloid": "text-teal-800 dark:text-teal-300",
  "polyatomic nonmetal": "text-green-800 dark:text-green-300",
  "diatomic nonmetal": "text-blue-800 dark:text-blue-300",
  "lanthanide": "text-indigo-800 dark:text-indigo-300",
  "actinide": "text-pink-800 dark:text-pink-300",
  "unknown": "text-gray-800 dark:text-gray-300",
};

// Background colors for elements
const bgColors: { [key: string]: string } = {
  "noble gas": "bg-purple-100 dark:bg-purple-900/20",
  "alkali metal": "bg-red-100 dark:bg-red-900/20",
  "alkaline earth metal": "bg-orange-100 dark:bg-orange-900/20",
  "transition metal": "bg-yellow-100 dark:bg-yellow-900/20",
  "post-transition metal": "bg-emerald-100 dark:bg-emerald-900/20",
  "metalloid": "bg-teal-100 dark:bg-teal-900/20",
  "polyatomic nonmetal": "bg-green-100 dark:bg-green-900/20",
  "diatomic nonmetal": "bg-blue-100 dark:bg-blue-900/20",
  "lanthanide": "bg-indigo-100 dark:bg-indigo-900/20",
  "actinide": "bg-pink-100 dark:bg-pink-900/20",
  "unknown": "bg-gray-100 dark:bg-gray-900/20",
};

// Dataset of all chemical elements (Periodic Table)
const elementsData: Element[] = [
  {
    atomic_number: 1,
    symbol: "H",
    name: "Hydrogen",
    atomic_mass: 1.008,
    electron_configuration: "1s1",
    electronegativity: 2.2,
    atomic_radius: 38,
    ionization_energy: 13.598,
    group: 1,
    period: 1,
    block: "s",
    category: "diatomic nonmetal",
    density: 0.0000899,
    melting_point: 14.01,
    boiling_point: 20.28,
    oxidation_states: "-1, +1",
    electron_configuration_semantic: "1s1",
    discovery_year: 1766,
    phase: "gas",
    shells: [1]
  },
  {
    atomic_number: 2,
    symbol: "He",
    name: "Helium",
    atomic_mass: 4.0026,
    electron_configuration: "1s2",
    electronegativity: 0,
    atomic_radius: 32,
    ionization_energy: 24.587,
    group: 18,
    period: 1,
    block: "s",
    category: "noble gas",
    density: 0.0001785,
    melting_point: 0.95,
    boiling_point: 4.22,
    oxidation_states: "0",
    electron_configuration_semantic: "1s2",
    discovery_year: 1868,
    phase: "gas",
    shells: [2]
  },
  {
    atomic_number: 3,
    symbol: "Li",
    name: "Lithium",
    atomic_mass: 6.94,
    electron_configuration: "1s2 2s1",
    electronegativity: 0.98,
    atomic_radius: 134,
    ionization_energy: 5.392,
    group: 1,
    period: 2,
    block: "s",
    category: "alkali metal",
    density: 0.534,
    melting_point: 453.69,
    boiling_point: 1603,
    oxidation_states: "+1",
    electron_configuration_semantic: "[He] 2s1",
    discovery_year: 1817,
    phase: "solid",
    shells: [2, 1]
  },
  {
    atomic_number: 4,
    symbol: "Be",
    name: "Beryllium",
    atomic_mass: 9.0122,
    electron_configuration: "1s2 2s2",
    electronegativity: 1.57,
    atomic_radius: 90,
    ionization_energy: 9.323,
    group: 2,
    period: 2,
    block: "s",
    category: "alkaline earth metal",
    density: 1.85,
    melting_point: 1560,
    boiling_point: 2742,
    oxidation_states: "+2",
    electron_configuration_semantic: "[He] 2s2",
    discovery_year: 1798,
    phase: "solid",
    shells: [2, 2]
  },
  {
    atomic_number: 5,
    symbol: "B",
    name: "Boron",
    atomic_mass: 10.81,
    electron_configuration: "1s2 2s2 2p1",
    electronegativity: 2.04,
    atomic_radius: 82,
    ionization_energy: 8.298,
    group: 13,
    period: 2,
    block: "p",
    category: "metalloid",
    density: 2.34,
    melting_point: 2349,
    boiling_point: 4200,
    oxidation_states: "+1, +2, +3",
    electron_configuration_semantic: "[He] 2s2 2p1",
    discovery_year: 1808,
    phase: "solid",
    shells: [2, 3]
  },
  {
    atomic_number: 6,
    symbol: "C",
    name: "Carbon",
    atomic_mass: 12.011,
    electron_configuration: "1s2 2s2 2p2",
    electronegativity: 2.55,
    atomic_radius: 77,
    ionization_energy: 11.260,
    group: 14,
    period: 2,
    block: "p",
    category: "polyatomic nonmetal",
    density: 2.267,
    melting_point: 3823,
    boiling_point: 4300,
    oxidation_states: "-4, -3, -2, -1, +1, +2, +3, +4",
    electron_configuration_semantic: "[He] 2s2 2p2",
    discovery_year: -1,
    phase: "solid",
    shells: [2, 4]
  },
  {
    atomic_number: 7,
    symbol: "N",
    name: "Nitrogen",
    atomic_mass: 14.007,
    electron_configuration: "1s2 2s2 2p3",
    electronegativity: 3.04,
    atomic_radius: 75,
    ionization_energy: 14.534,
    group: 15,
    period: 2,
    block: "p",
    category: "diatomic nonmetal",
    density: 0.001251,
    melting_point: 63.15,
    boiling_point: 77.36,
    oxidation_states: "-3, -2, -1, +1, +2, +3, +4, +5",
    electron_configuration_semantic: "[He] 2s2 2p3",
    discovery_year: 1772,
    phase: "gas",
    shells: [2, 5]
  },
  {
    atomic_number: 8,
    symbol: "O",
    name: "Oxygen",
    atomic_mass: 15.999,
    electron_configuration: "1s2 2s2 2p4",
    electronegativity: 3.44,
    atomic_radius: 73,
    ionization_energy: 13.618,
    group: 16,
    period: 2,
    block: "p",
    category: "diatomic nonmetal",
    density: 0.001429,
    melting_point: 54.36,
    boiling_point: 90.2,
    oxidation_states: "-2, -1, +1, +2",
    electron_configuration_semantic: "[He] 2s2 2p4",
    discovery_year: 1774,
    phase: "gas",
    shells: [2, 6]
  },
  {
    atomic_number: 9,
    symbol: "F",
    name: "Fluorine",
    atomic_mass: 18.998,
    electron_configuration: "1s2 2s2 2p5",
    electronegativity: 3.98,
    atomic_radius: 71,
    ionization_energy: 17.423,
    group: 17,
    period: 2,
    block: "p",
    category: "diatomic nonmetal",
    density: 0.001696,
    melting_point: 53.53,
    boiling_point: 85.03,
    oxidation_states: "-1",
    electron_configuration_semantic: "[He] 2s2 2p5",
    discovery_year: 1886,
    phase: "gas",
    shells: [2, 7]
  },
  {
    atomic_number: 10,
    symbol: "Ne",
    name: "Neon",
    atomic_mass: 20.18,
    electron_configuration: "1s2 2s2 2p6",
    electronegativity: 0,
    atomic_radius: 69,
    ionization_energy: 21.565,
    group: 18,
    period: 2,
    block: "p",
    category: "noble gas",
    density: 0.0009,
    melting_point: 24.56,
    boiling_point: 27.07,
    oxidation_states: "0",
    electron_configuration_semantic: "[He] 2s2 2p6",
    discovery_year: 1898,
    phase: "gas",
    shells: [2, 8]
  },
  {
    atomic_number: 11,
    symbol: "Na",
    name: "Sodium",
    atomic_mass: 22.99,
    electron_configuration: "1s2 2s2 2p6 3s1",
    electronegativity: 0.93,
    atomic_radius: 154,
    ionization_energy: 5.139,
    group: 1,
    period: 3,
    block: "s",
    category: "alkali metal",
    density: 0.971,
    melting_point: 370.87,
    boiling_point: 1156,
    oxidation_states: "-1, +1",
    electron_configuration_semantic: "[Ne] 3s1",
    discovery_year: 1807,
    phase: "solid",
    shells: [2, 8, 1]
  },
  {
    atomic_number: 12,
    symbol: "Mg",
    name: "Magnesium",
    atomic_mass: 24.305,
    electron_configuration: "1s2 2s2 2p6 3s2",
    electronegativity: 1.31,
    atomic_radius: 130,
    ionization_energy: 7.646,
    group: 2,
    period: 3,
    block: "s",
    category: "alkaline earth metal",
    density: 1.738,
    melting_point: 923,
    boiling_point: 1363,
    oxidation_states: "+1, +2",
    electron_configuration_semantic: "[Ne] 3s2",
    discovery_year: 1755,
    phase: "solid",
    shells: [2, 8, 2]
  },
  {
    atomic_number: 13,
    symbol: "Al",
    name: "Aluminum",
    atomic_mass: 26.982,
    electron_configuration: "1s2 2s2 2p6 3s2 3p1",
    electronegativity: 1.61,
    atomic_radius: 118,
    ionization_energy: 5.986,
    group: 13,
    period: 3,
    block: "p",
    category: "post-transition metal",
    density: 2.7,
    melting_point: 933.47,
    boiling_point: 2792,
    oxidation_states: "+1, +2, +3",
    electron_configuration_semantic: "[Ne] 3s2 3p1",
    discovery_year: 1825,
    phase: "solid",
    shells: [2, 8, 3]
  },
  {
    atomic_number: 14,
    symbol: "Si",
    name: "Silicon",
    atomic_mass: 28.085,
    electron_configuration: "1s2 2s2 2p6 3s2 3p2",
    electronegativity: 1.9,
    atomic_radius: 111,
    ionization_energy: 8.152,
    group: 14,
    period: 3,
    block: "p",
    category: "metalloid",
    density: 2.33,
    melting_point: 1687,
    boiling_point: 3538,
    oxidation_states: "-4, -3, -2, -1, +1, +2, +3, +4",
    electron_configuration_semantic: "[Ne] 3s2 3p2",
    discovery_year: 1824,
    phase: "solid",
    shells: [2, 8, 4]
  },
  {
    atomic_number: 15,
    symbol: "P",
    name: "Phosphorus",
    atomic_mass: 30.974,
    electron_configuration: "1s2 2s2 2p6 3s2 3p3",
    electronegativity: 2.19,
    atomic_radius: 106,
    ionization_energy: 10.487,
    group: 15,
    period: 3,
    block: "p",
    category: "polyatomic nonmetal",
    density: 1.82,
    melting_point: 317.3,
    boiling_point: 553.6,
    oxidation_states: "-3, -2, -1, +1, +2, +3, +4, +5",
    electron_configuration_semantic: "[Ne] 3s2 3p3",
    discovery_year: 1669,
    phase: "solid",
    shells: [2, 8, 5]
  },
  {
    atomic_number: 16,
    symbol: "S",
    name: "Sulfur",
    atomic_mass: 32.06,
    electron_configuration: "1s2 2s2 2p6 3s2 3p4",
    electronegativity: 2.58,
    atomic_radius: 102,
    ionization_energy: 10.36,
    group: 16,
    period: 3,
    block: "p",
    category: "polyatomic nonmetal",
    density: 2.07,
    melting_point: 388.36,
    boiling_point: 717.8,
    oxidation_states: "-2, -1, +1, +2, +3, +4, +5, +6",
    electron_configuration_semantic: "[Ne] 3s2 3p4",
    discovery_year: -1,
    phase: "solid",
    shells: [2, 8, 6]
  },
  {
    atomic_number: 17,
    symbol: "Cl",
    name: "Chlorine",
    atomic_mass: 35.45,
    electron_configuration: "1s2 2s2 2p6 3s2 3p5",
    electronegativity: 3.16,
    atomic_radius: 99,
    ionization_energy: 12.968,
    group: 17,
    period: 3,
    block: "p",
    category: "diatomic nonmetal",
    density: 0.003214,
    melting_point: 171.6,
    boiling_point: 239.11,
    oxidation_states: "-1, +1, +2, +3, +4, +5, +6, +7",
    electron_configuration_semantic: "[Ne] 3s2 3p5",
    discovery_year: 1774,
    phase: "gas",
    shells: [2, 8, 7]
  },
  {
    atomic_number: 18,
    symbol: "Ar",
    name: "Argon",
    atomic_mass: 39.948,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6",
    electronegativity: 0,
    atomic_radius: 97,
    ionization_energy: 15.76,
    group: 18,
    period: 3,
    block: "p",
    category: "noble gas",
    density: 0.001784,
    melting_point: 83.8,
    boiling_point: 87.3,
    oxidation_states: "0",
    electron_configuration_semantic: "[Ne] 3s2 3p6",
    discovery_year: 1894,
    phase: "gas",
    shells: [2, 8, 8]
  },
  {
    atomic_number: 19,
    symbol: "K",
    name: "Potassium",
    atomic_mass: 39.098,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 4s1",
    electronegativity: 0.82,
    atomic_radius: 196,
    ionization_energy: 4.34,
    group: 1,
    period: 4,
    block: "s",
    category: "alkali metal",
    density: 0.862,
    melting_point: 336.53,
    boiling_point: 1032,
    oxidation_states: "-1, +1",
    electron_configuration_semantic: "[Ar] 4s1",
    discovery_year: 1807,
    phase: "solid",
    shells: [2, 8, 8, 1]
  },
  {
    atomic_number: 20,
    symbol: "Ca",
    name: "Calcium",
    atomic_mass: 40.078,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 4s2",
    electronegativity: 1.0,
    atomic_radius: 174,
    ionization_energy: 6.113,
    group: 2,
    period: 4,
    block: "s",
    category: "alkaline earth metal",
    density: 1.54,
    melting_point: 1115,
    boiling_point: 1757,
    oxidation_states: "+1, +2",
    electron_configuration_semantic: "[Ar] 4s2",
    discovery_year: 1808,
    phase: "solid",
    shells: [2, 8, 8, 2]
  },
  {
    atomic_number: 21,
    symbol: "Sc",
    name: "Scandium",
    atomic_mass: 44.956,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d1 4s2",
    electronegativity: 1.36,
    atomic_radius: 144,
    ionization_energy: 6.561,
    group: 3,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 2.985,
    melting_point: 1814,
    boiling_point: 3109,
    oxidation_states: "+1, +2, +3",
    electron_configuration_semantic: "[Ar] 3d1 4s2",
    discovery_year: 1879,
    phase: "solid",
    shells: [2, 8, 9, 2]
  },
  {
    atomic_number: 22,
    symbol: "Ti",
    name: "Titanium",
    atomic_mass: 47.867,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d2 4s2",
    electronegativity: 1.54,
    atomic_radius: 132,
    ionization_energy: 6.828,
    group: 4,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 4.507,
    melting_point: 1941,
    boiling_point: 3560,
    oxidation_states: "-1, +1, +2, +3, +4",
    electron_configuration_semantic: "[Ar] 3d2 4s2",
    discovery_year: 1791,
    phase: "solid",
    shells: [2, 8, 10, 2]
  },
  {
    atomic_number: 23,
    symbol: "V",
    name: "Vanadium",
    atomic_mass: 50.942,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d3 4s2",
    electronegativity: 1.63,
    atomic_radius: 122,
    ionization_energy: 6.746,
    group: 5,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 6.11,
    melting_point: 2183,
    boiling_point: 3680,
    oxidation_states: "-1, +1, +2, +3, +4, +5",
    electron_configuration_semantic: "[Ar] 3d3 4s2",
    discovery_year: 1801,
    phase: "solid",
    shells: [2, 8, 11, 2]
  },
  {
    atomic_number: 24,
    symbol: "Cr",
    name: "Chromium",
    atomic_mass: 51.996,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d5 4s1",
    electronegativity: 1.66,
    atomic_radius: 118,
    ionization_energy: 6.767,
    group: 6,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 7.14,
    melting_point: 2180,
    boiling_point: 2944,
    oxidation_states: "-2, -1, +1, +2, +3, +4, +5, +6",
    electron_configuration_semantic: "[Ar] 3d5 4s1",
    discovery_year: 1797,
    phase: "solid",
    shells: [2, 8, 13, 1]
  },
  {
    atomic_number: 25,
    symbol: "Mn",
    name: "Manganese",
    atomic_mass: 54.938,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d5 4s2",
    electronegativity: 1.55,
    atomic_radius: 117,
    ionization_energy: 7.434,
    group: 7,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 7.47,
    melting_point: 1519,
    boiling_point: 2334,
    oxidation_states: "-3, -2, -1, +1, +2, +3, +4, +5, +6, +7",
    electron_configuration_semantic: "[Ar] 3d5 4s2",
    discovery_year: 1774,
    phase: "solid",
    shells: [2, 8, 13, 2]
  },
  {
    atomic_number: 26,
    symbol: "Fe",
    name: "Iron",
    atomic_mass: 55.845,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d6 4s2",
    electronegativity: 1.83,
    atomic_radius: 116,
    ionization_energy: 7.902,
    group: 8,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 7.874,
    melting_point: 1811,
    boiling_point: 3134,
    oxidation_states: "-2, -1, +1, +2, +3, +4, +5, +6, +7",
    electron_configuration_semantic: "[Ar] 3d6 4s2",
    discovery_year: -1,
    phase: "solid",
    shells: [2, 8, 14, 2]
  },
  {
    atomic_number: 27,
    symbol: "Co",
    name: "Cobalt",
    atomic_mass: 58.933,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d7 4s2",
    electronegativity: 1.88,
    atomic_radius: 111,
    ionization_energy: 7.881,
    group: 9,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 8.9,
    melting_point: 1768,
    boiling_point: 3200,
    oxidation_states: "-1, +1, +2, +3, +4, +5",
    electron_configuration_semantic: "[Ar] 3d7 4s2",
    discovery_year: 1735,
    phase: "solid",
    shells: [2, 8, 15, 2]
  },
  {
    atomic_number: 28,
    symbol: "Ni",
    name: "Nickel",
    atomic_mass: 58.693,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d8 4s2",
    electronegativity: 1.91,
    atomic_radius: 110,
    ionization_energy: 7.64,
    group: 10,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 8.908,
    melting_point: 1728,
    boiling_point: 3186,
    oxidation_states: "-1, +1, +2, +3, +4",
    electron_configuration_semantic: "[Ar] 3d8 4s2",
    discovery_year: 1751,
    phase: "solid",
    shells: [2, 8, 16, 2]
  },
  {
    atomic_number: 29,
    symbol: "Cu",
    name: "Copper",
    atomic_mass: 63.546,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s1",
    electronegativity: 1.9,
    atomic_radius: 128,
    ionization_energy: 7.726,
    group: 11,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 8.96,
    melting_point: 1357.77,
    boiling_point: 2835,
    oxidation_states: "-2, +1, +2, +3, +4",
    electron_configuration_semantic: "[Ar] 3d10 4s1",
    discovery_year: -1,
    phase: "solid",
    shells: [2, 8, 18, 1]
  },
  {
    atomic_number: 30,
    symbol: "Zn",
    name: "Zinc",
    atomic_mass: 65.38,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2",
    electronegativity: 1.65,
    atomic_radius: 120,
    ionization_energy: 9.394,
    group: 12,
    period: 4,
    block: "d",
    category: "transition metal",
    density: 7.14,
    melting_point: 692.88,
    boiling_point: 1180,
    oxidation_states: "+1, +2",
    electron_configuration_semantic: "[Ar] 3d10 4s2",
    discovery_year: 1746,
    phase: "solid",
    shells: [2, 8, 18, 2]
  },
  {
    atomic_number: 31,
    symbol: "Ga",
    name: "Gallium",
    atomic_mass: 69.723,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p1",
    electronegativity: 1.81,
    atomic_radius: 122,
    ionization_energy: 5.999,
    group: 13,
    period: 4,
    block: "p",
    category: "post-transition metal",
    density: 5.91,
    melting_point: 302.91,
    boiling_point: 2477,
    oxidation_states: "+1, +2, +3",
    electron_configuration_semantic: "[Ar] 3d10 4s2 4p1",
    discovery_year: 1875,
    phase: "solid",
    shells: [2, 8, 18, 3]
  },
  {
    atomic_number: 32,
    symbol: "Ge",
    name: "Germanium",
    atomic_mass: 72.63,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p2",
    electronegativity: 2.01,
    atomic_radius: 120,
    ionization_energy: 7.9,
    group: 14,
    period: 4,
    block: "p",
    category: "metalloid",
    density: 5.323,
    melting_point: 1211.4,
    boiling_point: 3106,
    oxidation_states: "-4, +1, +2, +3, +4",
    electron_configuration_semantic: "[Ar] 3d10 4s2 4p2",
    discovery_year: 1886,
    phase: "solid",
    shells: [2, 8, 18, 4]
  },
  {
    atomic_number: 33,
    symbol: "As",
    name: "Arsenic",
    atomic_mass: 74.922,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p3",
    electronegativity: 2.18,
    atomic_radius: 119,
    ionization_energy: 9.815,
    group: 15,
    period: 4,
    block: "p",
    category: "metalloid",
    density: 5.776,
    melting_point: 1090,
    boiling_point: 887,
    oxidation_states: "-3, +1, +2, +3, +5",
    electron_configuration_semantic: "[Ar] 3d10 4s2 4p3",
    discovery_year: -1,
    phase: "solid",
    shells: [2, 8, 18, 5]
  },
  {
    atomic_number: 34,
    symbol: "Se",
    name: "Selenium",
    atomic_mass: 78.971,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p4",
    electronegativity: 2.55,
    atomic_radius: 120,
    ionization_energy: 9.752,
    group: 16,
    period: 4,
    block: "p",
    category: "polyatomic nonmetal",
    density: 4.809,
    melting_point: 494,
    boiling_point: 958,
    oxidation_states: "-2, +1, +2, +4, +6",
    electron_configuration_semantic: "[Ar] 3d10 4s2 4p4",
    discovery_year: 1817,
    phase: "solid",
    shells: [2, 8, 18, 6]
  },
  {
    atomic_number: 35,
    symbol: "Br",
    name: "Bromine",
    atomic_mass: 79.904,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p5",
    electronegativity: 2.96,
    atomic_radius: 120,
    ionization_energy: 11.814,
    group: 17,
    period: 4,
    block: "p",
    category: "diatomic nonmetal",
    density: 3.11,
    melting_point: 265.8,
    boiling_point: 332,
    oxidation_states: "-1, +1, +3, +4, +5, +7",
    electron_configuration_semantic: "[Ar] 3d10 4s2 4p5",
    discovery_year: 1826,
    phase: "liquid",
    shells: [2, 8, 18, 7]
  },
  {
    atomic_number: 36,
    symbol: "Kr",
    name: "Krypton",
    atomic_mass: 83.798,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6",
    electronegativity: 3,
    atomic_radius: 116,
    ionization_energy: 14,
    group: 18,
    period: 4,
    block: "p",
    category: "noble gas",
    density: 0.003733,
    melting_point: 115.79,
    boiling_point: 119.93,
    oxidation_states: "0, +2",
    electron_configuration_semantic: "[Ar] 3d10 4s2 4p6",
    discovery_year: 1898,
    phase: "gas",
    shells: [2, 8, 18, 8]
  },
  {
    atomic_number: 37,
    symbol: "Rb",
    name: "Rubidium",
    atomic_mass: 85.468,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 5s1",
    electronegativity: 0.82,
    atomic_radius: 220,
    ionization_energy: 4.177,
    group: 1,
    period: 5,
    block: "s",
    category: "alkali metal",
    density: 1.532,
    melting_point: 312.46,
    boiling_point: 961,
    oxidation_states: "-1, +1",
    electron_configuration_semantic: "[Kr] 5s1",
    discovery_year: 1861,
    phase: "solid",
    shells: [2, 8, 18, 8, 1]
  },
  {
    atomic_number: 38,
    symbol: "Sr",
    name: "Strontium",
    atomic_mass: 87.62,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 5s2",
    electronegativity: 0.95,
    atomic_radius: 195,
    ionization_energy: 5.695,
    group: 2,
    period: 5,
    block: "s",
    category: "alkaline earth metal",
    density: 2.64,
    melting_point: 1050,
    boiling_point: 1655,
    oxidation_states: "+1, +2",
    electron_configuration_semantic: "[Kr] 5s2",
    discovery_year: 1790,
    phase: "solid",
    shells: [2, 8, 18, 8, 2]
  },
  {
    atomic_number: 39,
    symbol: "Y",
    name: "Yttrium",
    atomic_mass: 88.906,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d1 5s2",
    electronegativity: 1.22,
    atomic_radius: 180,
    ionization_energy: 6.217,
    group: 3,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 4.472,
    melting_point: 1799,
    boiling_point: 3609,
    oxidation_states: "+1, +2, +3",
    electron_configuration_semantic: "[Kr] 4d1 5s2",
    discovery_year: 1794,
    phase: "solid",
    shells: [2, 8, 18, 9, 2]
  },
  {
    atomic_number: 40,
    symbol: "Zr",
    name: "Zirconium",
    atomic_mass: 91.224,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d2 5s2",
    electronegativity: 1.33,
    atomic_radius: 160,
    ionization_energy: 6.634,
    group: 4,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 6.511,
    melting_point: 2128,
    boiling_point: 4682,
    oxidation_states: "+1, +2, +3, +4",
    electron_configuration_semantic: "[Kr] 4d2 5s2",
    discovery_year: 1789,
    phase: "solid",
    shells: [2, 8, 18, 10, 2]
  },
  {
    atomic_number: 41,
    symbol: "Nb",
    name: "Niobium",
    atomic_mass: 92.906,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d4 5s1",
    electronegativity: 1.6,
    atomic_radius: 146,
    ionization_energy: 6.759,
    group: 5,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 8.57,
    melting_point: 2750,
    boiling_point: 5017,
    oxidation_states: "-1, +2, +3, +4, +5",
    electron_configuration_semantic: "[Kr] 4d4 5s1",
    discovery_year: 1801,
    phase: "solid",
    shells: [2, 8, 18, 12, 1]
  },
  {
    atomic_number: 42,
    symbol: "Mo",
    name: "Molybdenum",
    atomic_mass: 95.95,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d5 5s1",
    electronegativity: 2.16,
    atomic_radius: 139,
    ionization_energy: 7.092,
    group: 6,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 10.28,
    melting_point: 2896,
    boiling_point: 4912,
    oxidation_states: "-4, -2, -1, +1, +2, +3, +4, +5, +6",
    electron_configuration_semantic: "[Kr] 4d5 5s1",
    discovery_year: 1781,
    phase: "solid",
    shells: [2, 8, 18, 13, 1]
  },
  {
    atomic_number: 43,
    symbol: "Tc",
    name: "Technetium",
    atomic_mass: 97,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d5 5s2",
    electronegativity: 1.9,
    atomic_radius: 136,
    ionization_energy: 7.28,
    group: 7,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 11.5,
    melting_point: 2430,
    boiling_point: 4538,
    oxidation_states: "-3, -1, +1, +2, +3, +4, +5, +6, +7",
    electron_configuration_semantic: "[Kr] 4d5 5s2",
    discovery_year: 1937,
    phase: "solid",
    shells: [2, 8, 18, 13, 2]
  },
  {
    atomic_number: 44,
    symbol: "Ru",
    name: "Ruthenium",
    atomic_mass: 101.07,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d7 5s1",
    electronegativity: 2.2,
    atomic_radius: 134,
    ionization_energy: 7.361,
    group: 8,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 12.45,
    melting_point: 2607,
    boiling_point: 4423,
    oxidation_states: "-2, +1, +2, +3, +4, +5, +6, +7, +8",
    electron_configuration_semantic: "[Kr] 4d7 5s1",
    discovery_year: 1844,
    phase: "solid",
    shells: [2, 8, 18, 15, 1]
  },
  {
    atomic_number: 45,
    symbol: "Rh",
    name: "Rhodium",
    atomic_mass: 102.91,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d8 5s1",
    electronegativity: 2.28,
    atomic_radius: 134,
    ionization_energy: 7.459,
    group: 9,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 12.41,
    melting_point: 2237,
    boiling_point: 3968,
    oxidation_states: "-1, +1, +2, +3, +4, +5, +6",
    electron_configuration_semantic: "[Kr] 4d8 5s1",
    discovery_year: 1803,
    phase: "solid",
    shells: [2, 8, 18, 16, 1]
  },
  {
    atomic_number: 46,
    symbol: "Pd",
    name: "Palladium",
    atomic_mass: 106.42,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10",
    electronegativity: 2.2,
    atomic_radius: 137,
    ionization_energy: 8.337,
    group: 10,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 12.023,
    melting_point: 1828.05,
    boiling_point: 3236,
    oxidation_states: "0, +1, +2, +3, +4, +6",
    electron_configuration_semantic: "[Kr] 4d10",
    discovery_year: 1803,
    phase: "solid",
    shells: [2, 8, 18, 18]
  },
  {
    atomic_number: 47,
    symbol: "Ag",
    name: "Silver",
    atomic_mass: 107.87,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s1",
    electronegativity: 1.93,
    atomic_radius: 144,
    ionization_energy: 7.576,
    group: 11,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 10.49,
    melting_point: 1234.93,
    boiling_point: 2435,
    oxidation_states: "-2, -1, +1, +2, +3",
    electron_configuration_semantic: "[Kr] 4d10 5s1",
    discovery_year: -1,
    phase: "solid",
    shells: [2, 8, 18, 18, 1]
  },
  {
    atomic_number: 48,
    symbol: "Cd",
    name: "Cadmium",
    atomic_mass: 112.41,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2",
    electronegativity: 1.69,
    atomic_radius: 151,
    ionization_energy: 8.993,
    group: 12,
    period: 5,
    block: "d",
    category: "transition metal",
    density: 8.65,
    melting_point: 594.22,
    boiling_point: 1040,
    oxidation_states: "+1, +2",
    electron_configuration_semantic: "[Kr] 4d10 5s2",
    discovery_year: 1817,
    phase: "solid",
    shells: [2, 8, 18, 18, 2]
  },
  {
    atomic_number: 49,
    symbol: "In",
    name: "Indium",
    atomic_mass: 114.82,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p1",
    electronegativity: 1.78,
    atomic_radius: 155,
    ionization_energy: 5.786,
    group: 13,
    period: 5,
    block: "p",
    category: "post-transition metal",
    density: 7.31,
    melting_point: 429.75,
    boiling_point: 2345,
    oxidation_states: "-5, +1, +2, +3",
    electron_configuration_semantic: "[Kr] 4d10 5s2 5p1",
    discovery_year: 1863,
    phase: "solid",
    shells: [2, 8, 18, 18, 3]
  },
  {
    atomic_number: 50,
    symbol: "Sn",
    name: "Tin",
    atomic_mass: 118.71,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p2",
    electronegativity: 1.96,
    atomic_radius: 145,
    ionization_energy: 7.344,
    group: 14,
    period: 5,
    block: "p",
    category: "post-transition metal",
    density: 7.287,
    melting_point: 505.08,
    boiling_point: 2875,
    oxidation_states: "-4, +2, +4",
    electron_configuration_semantic: "[Kr] 4d10 5s2 5p2",
    discovery_year: -1,
    phase: "solid",
    shells: [2, 8, 18, 18, 4]
  },
  {
    atomic_number: 51,
    symbol: "Sb",
    name: "Antimony",
    atomic_mass: 121.76,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p3",
    electronegativity: 2.05,
    atomic_radius: 133,
    ionization_energy: 8.64,
    group: 15,
    period: 5,
    block: "p",
    category: "metalloid",
    density: 6.685,
    melting_point: 903.78,
    boiling_point: 1860,
    oxidation_states: "-3, +3, +5",
    electron_configuration_semantic: "[Kr] 4d10 5s2 5p3",
    discovery_year: -1,
    phase: "solid",
    shells: [2, 8, 18, 18, 5]
  },
  {
    atomic_number: 52,
    symbol: "Te",
    name: "Tellurium",
    atomic_mass: 127.6,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p4",
    electronegativity: 2.1,
    atomic_radius: 123,
    ionization_energy: 9.01,
    group: 16,
    period: 5,
    block: "p",
    category: "metalloid",
    density: 6.232,
    melting_point: 722.66,
    boiling_point: 1261,
    oxidation_states: "-2, +2, +4, +5, +6",
    electron_configuration_semantic: "[Kr] 4d10 5s2 5p4",
    discovery_year: 1782,
    phase: "solid",
    shells: [2, 8, 18, 18, 6]
  },
  {
    atomic_number: 53,
    symbol: "I",
    name: "Iodine",
    atomic_mass: 126.9,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p5",
    electronegativity: 2.66,
    atomic_radius: 115,
    ionization_energy: 10.451,
    group: 17,
    period: 5,
    block: "p",
    category: "diatomic nonmetal",
    density: 4.93,
    melting_point: 386.85,
    boiling_point: 457.4,
    oxidation_states: "-1, +1, +3, +5, +7",
    electron_configuration_semantic: "[Kr] 4d10 5s2 5p5",
    discovery_year: 1811,
    phase: "solid",
    shells: [2, 8, 18, 18, 7]
  },
  {
    atomic_number: 54,
    symbol: "Xe",
    name: "Xenon",
    atomic_mass: 131.29,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6",
    electronegativity: 2.6,
    atomic_radius: 108,
    ionization_energy: 12.13,
    group: 18,
    period: 5,
    block: "p",
    category: "noble gas",
    density: 0.005887,
    melting_point: 161.4,
    boiling_point: 165.03,
    oxidation_states: "0, +2, +4, +6, +8",
    electron_configuration_semantic: "[Kr] 4d10 5s2 5p6",
    discovery_year: 1898,
    phase: "gas",
    shells: [2, 8, 18, 18, 8]
  },
  {
    atomic_number: 55,
    symbol: "Cs",
    name: "Cesium",
    atomic_mass: 132.91,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 6s1",
    electronegativity: 0.79,
    atomic_radius: 260,
    ionization_energy: 3.894,
    group: 1,
    period: 6,
    block: "s",
    category: "alkali metal",
    density: 1.873,
    melting_point: 301.59,
    boiling_point: 944,
    oxidation_states: "-1, +1",
    electron_configuration_semantic: "[Xe] 6s1",
    discovery_year: 1860,
    phase: "solid",
    shells: [2, 8, 18, 18, 8, 1]
  },
  {
    atomic_number: 56,
    symbol: "Ba",
    name: "Barium",
    atomic_mass: 137.33,
    electron_configuration: "1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s2 5p6 6s2",
    electronegativity: 0.89,
    atomic_radius: 215,
    ionization_energy: 5.212,
    group: 2,
    period: 6,
    block: "s",
    category: "alkaline earth metal",
    density: 3.51,
    melting_point: 1000,
    boiling_point: 2170,
    oxidation_states: "+1, +2",
    electron_configuration_semantic: "[Xe] 6s2",
    discovery_year: 1774,
    phase: "solid",
    shells: [2, 8, 18, 18, 8, 2]
  }
];

const ChemicalElements = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("atomic_number");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  // Filter and sort elements
  const filteredElements = elementsData
    .filter((element) => {
      // Search filter
      const searchMatch = 
        element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        element.atomic_number.toString().includes(searchTerm.toLowerCase());
      
      // Category filter
      const categoryMatch = 
        categoryFilter === "all" || 
        element.category.toLowerCase().includes(categoryFilter.toLowerCase());
      
      // State filter
      const stateMatch = 
        stateFilter === "all" || 
        element.phase.toLowerCase() === stateFilter.toLowerCase();
      
      return searchMatch && categoryMatch && stateMatch;
    })
    .sort((a, b) => {
      const sortField = sortBy as keyof Element;
      if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
        return sortOrder === 'asc' 
          ? (a[sortField] as string).localeCompare(b[sortField] as string)
          : (b[sortField] as string).localeCompare(a[sortField] as string);
      } else {
        return sortOrder === 'asc' 
          ? (a[sortField] as number) - (b[sortField] as number)
          : (b[sortField] as number) - (a[sortField] as number);
      }
    });

  // Group elements for periodic table view
  const groupedElements: (Element | null)[][] = Array(10).fill(null).map(() => Array(18).fill(null));
  
  elementsData.forEach(element => {
    if (element.period <= 7 && element.group <= 18) {
      groupedElements[element.period - 1][element.group - 1] = element;
    }
  });

  // Generate unique categories
  const categories = ["all", ...Array.from(new Set(elementsData.map(el => el.category)))];
  
  // Handle element selection
  const handleElementClick = (element: Element) => {
    setSelectedElement(element);
    setShowDialog(true);
  };

  return (
    <ToolLayout
      title="Chemical Elements Reference"
      description="Explore the periodic table and properties of chemical elements"
      icon={<Atom className="h-6 w-6 text-blue-500" />}
    >
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="periodic">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="periodic">Periodic Table</TabsTrigger>
            <TabsTrigger value="list">Element List</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>
          
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search elements by name, symbol, or atomic number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : 
                          category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Physical State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="liquid">Liquid</SelectItem>
                    <SelectItem value="gas">Gas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <TabsContent value="periodic">
            <Card>
              <CardHeader>
                <CardTitle>Periodic Table of Elements</CardTitle>
                <CardDescription>
                  Click on an element to view detailed information
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[950px]">
                  {/* Periodic Table */}
                  <div className="grid grid-cols-18 gap-1">
                    {/* Group labels */}
                    <div className="col-span-1"></div>
                    {Array.from({ length: 18 }, (_, i) => (
                      <div key={i} className="text-center text-xs font-medium py-2 text-muted-foreground">
                        {i + 1}
                      </div>
                    ))}
                    
                    {/* Elements grid */}
                    {groupedElements.map((period, periodIndex) => (
                      <React.Fragment key={periodIndex}>
                        {/* Period label */}
                        <div className="text-xs font-medium flex items-center justify-center text-muted-foreground">
                          {periodIndex + 1}
                        </div>
                        
                        {/* Elements in this period */}
                        {period.map((element, groupIndex) => {
                          // Special positioning for lanthanides and actinides
                          if (periodIndex === 5 && groupIndex === 2) {
                            return (
                              <div 
                                key={`${periodIndex}-${groupIndex}`} 
                                className={`text-center px-1 py-1 ${bgColors['lanthanide']}`}
                                style={{ aspectRatio: '1/1' }}
                              >
                                <div className="text-xs">La-Lu</div>
                              </div>
                            );
                          }
                          
                          if (periodIndex === 6 && groupIndex === 2) {
                            return (
                              <div 
                                key={`${periodIndex}-${groupIndex}`} 
                                className={`text-center px-1 py-1 ${bgColors['actinide']}`}
                                style={{ aspectRatio: '1/1' }}
                              >
                                <div className="text-xs">Ac-Lr</div>
                              </div>
                            );
                          }
                          
                          if (!element) {
                            return <div key={`${periodIndex}-${groupIndex}`} className="col-span-1"></div>;
                          }
                          
                          return (
                            <div 
                              key={`${periodIndex}-${groupIndex}`}
                              className={`text-center p-1 ${bgColors[element.category] || 'bg-gray-100'} hover:opacity-80 cursor-pointer`}
                              style={{ aspectRatio: '1/1' }}
                              onClick={() => handleElementClick(element)}
                            >
                              <div className="text-xs text-muted-foreground">{element.atomic_number}</div>
                              <div className="text-lg font-bold">{element.symbol}</div>
                              <div className="text-xs truncate">{element.name}</div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                  
                  {/* Categories legend */}
                  <div className="mt-8 flex flex-wrap gap-3 justify-center">
                    {categories.filter(c => c !== 'all').map((category) => (
                      <div key={category} className="flex items-center gap-2">
                        <div 
                          className={`w-4 h-4 ${bgColors[category]}`}
                        ></div>
                        <span className="text-sm">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Element List</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atomic_number">Atomic Number</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="symbol">Symbol</SelectItem>
                        <SelectItem value="atomic_mass">Atomic Mass</SelectItem>
                        <SelectItem value="discovery_year">Discovery Year</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {filteredElements.length} elements found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredElements.map((element) => (
                    <div 
                      key={element.atomic_number}
                      className={`p-4 rounded-lg ${bgColors[element.category]} hover:opacity-90 cursor-pointer`}
                      onClick={() => handleElementClick(element)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xl font-bold">{element.symbol}</div>
                        <div className="text-sm">{element.atomic_number}</div>
                      </div>
                      <div className="text-base font-medium">{element.name}</div>
                      <div className="text-sm mt-1">{element.category}</div>
                      <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Mass:</span> {element.atomic_mass.toFixed(2)}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Group:</span> {element.group}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredElements.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No elements found matching your criteria
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Element Properties</CardTitle>
                <CardDescription>
                  Compare properties of the chemical elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Symbol</th>
                        <th className="text-left p-2 font-medium">Atomic #</th>
                        <th className="text-left p-2 font-medium">Mass</th>
                        <th className="text-left p-2 font-medium">Category</th>
                        <th className="text-left p-2 font-medium">State</th>
                        <th className="text-left p-2 font-medium">Electronegativity</th>
                        <th className="text-left p-2 font-medium">Group/Period</th>
                        <th className="text-left p-2 font-medium">Discovery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredElements.map((element) => (
                        <tr 
                          key={element.atomic_number} 
                          className="border-b hover:bg-muted/30 cursor-pointer"
                          onClick={() => handleElementClick(element)}
                        >
                          <td className="p-2">{element.name}</td>
                          <td className="p-2 font-medium">{element.symbol}</td>
                          <td className="p-2">{element.atomic_number}</td>
                          <td className="p-2">{element.atomic_mass.toFixed(2)}</td>
                          <td className="p-2">
                            <Badge variant="outline" className={bgColors[element.category]}>
                              {element.category}
                            </Badge>
                          </td>
                          <td className="p-2 capitalize">{element.phase}</td>
                          <td className="p-2">{element.electronegativity || 'N/A'}</td>
                          <td className="p-2">{element.group}/{element.period}</td>
                          <td className="p-2">
                            {element.discovery_year > 0 ? element.discovery_year : 'Ancient'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {filteredElements.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No elements found matching your criteria
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Element Detail Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-xl">
            {selectedElement && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div 
                      className={`w-6 h-6 ${bgColors[selectedElement.category]} rounded-full`}
                    ></div>
                    {selectedElement.name} ({selectedElement.symbol})
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className={`p-4 rounded-lg ${bgColors[selectedElement.category]} text-center`}>
                    <div className="text-xs text-muted-foreground">Atomic #</div>
                    <div className="text-3xl font-bold">{selectedElement.atomic_number}</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${bgColors[selectedElement.category]} text-center`}>
                    <div className="text-xs text-muted-foreground">Symbol</div>
                    <div className="text-3xl font-bold">{selectedElement.symbol}</div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${bgColors[selectedElement.category]} text-center`}>
                    <div className="text-xs text-muted-foreground">Mass</div>
                    <div className="text-2xl font-bold">{selectedElement.atomic_mass.toFixed(3)}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Category:</span> {selectedElement.category}</div>
                      <div><span className="text-muted-foreground">Phase:</span> {selectedElement.phase}</div>
                      <div><span className="text-muted-foreground">Group/Period:</span> {selectedElement.group}/{selectedElement.period}</div>
                      <div><span className="text-muted-foreground">Block:</span> {selectedElement.block}</div>
                      <div><span className="text-muted-foreground">Discovery:</span> {selectedElement.discovery_year > 0 ? selectedElement.discovery_year : 'Ancient'}</div>
                      <div><span className="text-muted-foreground">Electron Configuration:</span> {selectedElement.electron_configuration_semantic}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Beaker className="h-4 w-4 text-muted-foreground" />
                      Physical Properties
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Density:</span> {selectedElement.density} g/cm³</div>
                      <div><span className="text-muted-foreground">Atomic Radius:</span> {selectedElement.atomic_radius} pm</div>
                      <div><span className="text-muted-foreground">Melting Point:</span> {selectedElement.melting_point} K</div>
                      <div><span className="text-muted-foreground">Boiling Point:</span> {selectedElement.boiling_point} K</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      Electronic Properties
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Electronegativity:</span> {selectedElement.electronegativity || 'N/A'}</div>
                      <div><span className="text-muted-foreground">Ionization Energy:</span> {selectedElement.ionization_energy} eV</div>
                      <div><span className="text-muted-foreground">Electron Shells:</span> {selectedElement.shells.join(', ')}</div>
                      <div><span className="text-muted-foreground">Oxidation States:</span> {selectedElement.oxidation_states}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Legend for categories */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h3 className="text-base font-medium mb-3 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Element Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {categories.filter(c => c !== 'all').map((category) => (
              <div 
                key={category} 
                className="flex items-center gap-2 p-2 rounded-md bg-background"
              >
                <div 
                  className={`w-4 h-4 ${bgColors[category]}`}
                ></div>
                <span className="text-sm">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ChemicalElements;
