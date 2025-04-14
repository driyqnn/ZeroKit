
import React, { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Calculator, ChevronDown, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import UnitConverterSelect from '@/components/physics-calculator/UnitConverterSelect';
import { convertUnit } from '@/components/physics-calculator/UnitConverter';

interface FormulaInfo {
  name: string;
  formula: string;
  description: string;
  variables: { [key: string]: string };
  units: { [key: string]: string };
  unitTypes: { [key: string]: string };
  category: string;
  solve: (values: { [key: string]: number }) => { [key: string]: number | string };
  steps?: (values: { [key: string]: number }, solveFor: string) => string[];
}

const PhysicsCalculator = () => {
  const [selectedFormula, setSelectedFormula] = useState<string>("velocity");
  const [solveFor, setSolveFor] = useState<string>("");
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [units, setUnits] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<{ [key: string]: number | string } | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const formulas: { [key: string]: FormulaInfo } = {
    velocity: {
      name: "Velocity",
      formula: "v = d / t",
      description: "Calculate velocity, distance, or time using the relationship between them",
      variables: {
        v: "Velocity",
        d: "Distance",
        t: "Time"
      },
      units: {
        v: "m/s",
        d: "m",
        t: "s"
      },
      unitTypes: {
        v: "velocity",
        d: "length",
        t: "time"
      },
      category: "mechanics",
      solve: (values) => {
        const { v, d, t } = values;
        if (v === undefined) {
          return { v: d / t };
        } else if (d === undefined) {
          return { d: v * t };
        } else if (t === undefined) {
          return { t: d / v };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { v, d, t } = values;
        if (solveFor === "v") {
          return [
            "Starting with the formula: v = d / t",
            `Substitute the known values: v = ${d} / ${t}`,
            `Calculate: v = ${(d / t).toFixed(4)} m/s`
          ];
        } else if (solveFor === "d") {
          return [
            "Starting with the formula: d = v × t",
            `Substitute the known values: d = ${v} × ${t}`,
            `Calculate: d = ${(v * t).toFixed(4)} m`
          ];
        } else if (solveFor === "t") {
          return [
            "Starting with the formula: t = d / v",
            `Substitute the known values: t = ${d} / ${v}`,
            `Calculate: t = ${(d / v).toFixed(4)} s`
          ];
        }
        return [];
      }
    },
    force: {
      name: "Force",
      formula: "F = m * a",
      description: "Calculate force, mass, or acceleration using Newton's second law",
      variables: {
        F: "Force",
        m: "Mass",
        a: "Acceleration"
      },
      units: {
        F: "N",
        m: "kg",
        a: "m/s²"
      },
      unitTypes: {
        F: "force",
        m: "mass",
        a: "acceleration"
      },
      category: "mechanics",
      solve: (values) => {
        const { F, m, a } = values;
        if (F === undefined) {
          return { F: m * a };
        } else if (m === undefined) {
          return { m: F / a };
        } else if (a === undefined) {
          return { a: F / m };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { F, m, a } = values;
        if (solveFor === "F") {
          return [
            "Starting with the formula: F = m × a",
            `Substitute the known values: F = ${m} × ${a}`,
            `Calculate: F = ${(m * a).toFixed(4)} N`
          ];
        } else if (solveFor === "m") {
          return [
            "Starting with the formula: m = F / a",
            `Substitute the known values: m = ${F} / ${a}`,
            `Calculate: m = ${(F / a).toFixed(4)} kg`
          ];
        } else if (solveFor === "a") {
          return [
            "Starting with the formula: a = F / m",
            `Substitute the known values: a = ${F} / ${m}`,
            `Calculate: a = ${(F / m).toFixed(4)} m/s²`
          ];
        }
        return [];
      }
    },
    potentialEnergy: {
      name: "Potential Energy",
      formula: "PE = m * g * h",
      description: "Calculate potential energy, mass, height, or gravitational acceleration",
      variables: {
        PE: "Potential Energy",
        m: "Mass",
        g: "Gravitational Acceleration",
        h: "Height"
      },
      units: {
        PE: "J",
        m: "kg",
        g: "m/s²",
        h: "m"
      },
      unitTypes: {
        PE: "energy",
        m: "mass",
        g: "acceleration",
        h: "length"
      },
      category: "mechanics",
      solve: (values) => {
        const { PE, m, g, h } = values;
        if (PE === undefined) {
          return { PE: m * g * h };
        } else if (m === undefined) {
          return { m: PE / (g * h) };
        } else if (h === undefined) {
          return { h: PE / (m * g) };
        } else if (g === undefined) {
          return { g: PE / (m * h) };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { PE, m, g, h } = values;
        if (solveFor === "PE") {
          return [
            "Starting with the formula: PE = m × g × h",
            `Substitute the known values: PE = ${m} × ${g} × ${h}`,
            `Calculate: PE = ${(m * g * h).toFixed(4)} J`
          ];
        } else if (solveFor === "m") {
          return [
            "Starting with the formula: m = PE / (g × h)",
            `Substitute the known values: m = ${PE} / (${g} × ${h})`,
            `Calculate: m = ${(PE / (g * h)).toFixed(4)} kg`
          ];
        } else if (solveFor === "h") {
          return [
            "Starting with the formula: h = PE / (m × g)",
            `Substitute the known values: h = ${PE} / (${m} × ${g})`,
            `Calculate: h = ${(PE / (m * g)).toFixed(4)} m`
          ];
        } else if (solveFor === "g") {
          return [
            "Starting with the formula: g = PE / (m × h)",
            `Substitute the known values: g = ${PE} / (${m} × ${h})`,
            `Calculate: g = ${(PE / (m * h)).toFixed(4)} m/s²`
          ];
        }
        return [];
      }
    },
    kineticEnergy: {
      name: "Kinetic Energy",
      formula: "KE = 0.5 * m * v^2",
      description: "Calculate kinetic energy, mass, or velocity",
      variables: {
        KE: "Kinetic Energy",
        m: "Mass",
        v: "Velocity"
      },
      units: {
        KE: "J",
        m: "kg",
        v: "m/s"
      },
      unitTypes: {
        KE: "energy",
        m: "mass",
        v: "velocity"
      },
      category: "mechanics",
      solve: (values) => {
        const { KE, m, v } = values;
        if (KE === undefined) {
          return { KE: 0.5 * m * Math.pow(v, 2) };
        } else if (m === undefined) {
          return { m: 2 * KE / Math.pow(v, 2) };
        } else if (v === undefined) {
          return { v: Math.sqrt(2 * KE / m) };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { KE, m, v } = values;
        if (solveFor === "KE") {
          return [
            "Starting with the formula: KE = 0.5 × m × v²",
            `Substitute the known values: KE = 0.5 × ${m} × ${v}²`,
            `Calculate: KE = ${(0.5 * m * Math.pow(v, 2)).toFixed(4)} J`
          ];
        } else if (solveFor === "m") {
          return [
            "Starting with the formula: m = 2 × KE / v²",
            `Substitute the known values: m = 2 × ${KE} / ${v}²`,
            `Calculate: m = ${(2 * KE / Math.pow(v, 2)).toFixed(4)} kg`
          ];
        } else if (solveFor === "v") {
          return [
            "Starting with the formula: v = √(2 × KE / m)",
            `Substitute the known values: v = √(2 × ${KE} / ${m})`,
            `Calculate: v = ${Math.sqrt(2 * KE / m).toFixed(4)} m/s`
          ];
        }
        return [];
      }
    },
    pressure: {
      name: "Pressure",
      formula: "P = F / A",
      description: "Calculate pressure, force, or area",
      variables: {
        P: "Pressure",
        F: "Force",
        A: "Area"
      },
      units: {
        P: "Pa",
        F: "N",
        A: "m²"
      },
      unitTypes: {
        P: "pressure",
        F: "force",
        A: "area"
      },
      category: "thermodynamics",
      solve: (values) => {
        const { P, F, A } = values;
        if (P === undefined) {
          return { P: F / A };
        } else if (F === undefined) {
          return { F: P * A };
        } else if (A === undefined) {
          return { A: F / P };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { P, F, A } = values;
        if (solveFor === "P") {
          return [
            "Starting with the formula: P = F / A",
            `Substitute the known values: P = ${F} / ${A}`,
            `Calculate: P = ${(F / A).toFixed(4)} Pa`
          ];
        } else if (solveFor === "F") {
          return [
            "Starting with the formula: F = P × A",
            `Substitute the known values: F = ${P} × ${A}`,
            `Calculate: F = ${(P * A).toFixed(4)} N`
          ];
        } else if (solveFor === "A") {
          return [
            "Starting with the formula: A = F / P",
            `Substitute the known values: A = ${F} / ${P}`,
            `Calculate: A = ${(F / P).toFixed(4)} m²`
          ];
        }
        return [];
      }
    },
    idealGasLaw: {
      name: "Ideal Gas Law",
      formula: "PV = nRT",
      description: "Calculate pressure, volume, amount of substance, or temperature of an ideal gas",
      variables: {
        P: "Pressure",
        V: "Volume",
        n: "Amount of Substance",
        R: "Ideal Gas Constant",
        T: "Temperature"
      },
      units: {
        P: "Pa",
        V: "m³",
        n: "mol",
        R: "8.314",
        T: "K"
      },
      unitTypes: {
        P: "pressure",
        V: "volume",
        n: "default",
        R: "default",
        T: "default"
      },
      category: "thermodynamics",
      solve: (values) => {
        const R = 8.314; // Ideal gas constant
        const { P, V, n, T } = values;
        if (P === undefined) {
          return { P: (n * R * T) / V };
        } else if (V === undefined) {
          return { V: (n * R * T) / P };
        } else if (n === undefined) {
          return { n: (P * V) / (R * T) };
        } else if (T === undefined) {
          return { T: (P * V) / (n * R) };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const R = 8.314; // Ideal gas constant
        const { P, V, n, T } = values;
        if (solveFor === "P") {
          return [
            "Starting with the formula: P = (n × R × T) / V",
            `Substitute the known values: P = (${n} × ${R} × ${T}) / ${V}`,
            `Calculate: P = ${((n * R * T) / V).toFixed(4)} Pa`
          ];
        } else if (solveFor === "V") {
          return [
            "Starting with the formula: V = (n × R × T) / P",
            `Substitute the known values: V = (${n} × ${R} × ${T}) / ${P}`,
            `Calculate: V = ${((n * R * T) / P).toFixed(4)} m³`
          ];
        } else if (solveFor === "n") {
          return [
            "Starting with the formula: n = (P × V) / (R × T)",
            `Substitute the known values: n = (${P} × ${V}) / (${R} × ${T})`,
            `Calculate: n = ${((P * V) / (R * T)).toFixed(4)} mol`
          ];
        } else if (solveFor === "T") {
          return [
            "Starting with the formula: T = (P × V) / (n × R)",
            `Substitute the known values: T = (${P} × ${V}) / (${n} × ${R})`,
            `Calculate: T = ${((P * V) / (n * R)).toFixed(4)} K`
          ];
        }
        return [];
      }
    },
    ohmsLaw: {
      name: "Ohm's Law",
      formula: "V = I * R",
      description: "Calculate voltage, current, or resistance in a circuit",
      variables: {
        V: "Voltage",
        I: "Current",
        R: "Resistance"
      },
      units: {
        V: "V",
        I: "A",
        R: "Ω"
      },
      unitTypes: {
        V: "voltage",
        I: "current",
        R: "resistance"
      },
      category: "electromagnetism",
      solve: (values) => {
        const { V, I, R } = values;
        if (V === undefined) {
          return { V: I * R };
        } else if (I === undefined) {
          return { I: V / R };
        } else if (R === undefined) {
          return { R: V / I };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { V, I, R } = values;
        if (solveFor === "V") {
          return [
            "Starting with the formula: V = I × R",
            `Substitute the known values: V = ${I} × ${R}`,
            `Calculate: V = ${(I * R).toFixed(4)} V`
          ];
        } else if (solveFor === "I") {
          return [
            "Starting with the formula: I = V / R",
            `Substitute the known values: I = ${V} / ${R}`,
            `Calculate: I = ${(V / R).toFixed(4)} A`
          ];
        } else if (solveFor === "R") {
          return [
            "Starting with the formula: R = V / I",
            `Substitute the known values: R = ${V} / ${I}`,
            `Calculate: R = ${(V / I).toFixed(4)} Ω`
          ];
        }
        return [];
      }
    },
    magneticForce: {
      name: "Magnetic Force",
      formula: "F = q * v * B",
      description: "Calculate the magnetic force on a moving charge",
      variables: {
        F: "Magnetic Force",
        q: "Charge",
        v: "Velocity",
        B: "Magnetic Field"
      },
      units: {
        F: "N",
        q: "C",
        v: "m/s",
        B: "T"
      },
      unitTypes: {
        F: "force",
        q: "charge",
        v: "velocity",
        B: "magnetic-field"
      },
      category: "electromagnetism",
      solve: (values) => {
        const { F, q, v, B } = values;
        if (F === undefined) {
          return { F: q * v * B };
        } else if (q === undefined) {
          return { q: F / (v * B) };
        } else if (v === undefined) {
          return { v: F / (q * B) };
        } else if (B === undefined) {
          return { B: F / (q * v) };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { F, q, v, B } = values;
        if (solveFor === "F") {
          return [
            "Starting with the formula: F = q × v × B",
            `Substitute the known values: F = ${q} × ${v} × ${B}`,
            `Calculate: F = ${(q * v * B).toFixed(4)} N`
          ];
        } else if (solveFor === "q") {
          return [
            "Starting with the formula: q = F / (v × B)",
            `Substitute the known values: q = ${F} / (${v} × ${B})`,
            `Calculate: q = ${(F / (v * B)).toFixed(4)} C`
          ];
        } else if (solveFor === "v") {
          return [
            "Starting with the formula: v = F / (q × B)",
            `Substitute the known values: v = ${F} / (${q} × ${B})`,
            `Calculate: v = ${(F / (q * B)).toFixed(4)} m/s`
          ];
        } else if (solveFor === "B") {
          return [
            "Starting with the formula: B = F / (q × v)",
            `Substitute the known values: B = ${F} / (${q} × ${v})`,
            `Calculate: B = ${(F / (q * v)).toFixed(4)} T`
          ];
        }
        return [];
      }
    },
    waveEquation: {
      name: "Wave Equation",
      formula: "v = f * λ",
      description: "Calculate wave speed, frequency, or wavelength",
      variables: {
        v: "Wave Speed",
        f: "Frequency",
        λ: "Wavelength"
      },
      units: {
        v: "m/s",
        f: "Hz",
        λ: "m"
      },
      unitTypes: {
        v: "velocity",
        f: "frequency",
        λ: "wavelength"
      },
      category: "waves",
      solve: (values) => {
        const { v, f, λ } = values;
        if (v === undefined) {
          return { v: f * λ };
        } else if (f === undefined) {
          return { f: v / λ };
        } else if (λ === undefined) {
          return { λ: v / f };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { v, f, λ } = values;
        if (solveFor === "v") {
          return [
            "Starting with the formula: v = f × λ",
            `Substitute the known values: v = ${f} × ${λ}`,
            `Calculate: v = ${(f * λ).toFixed(4)} m/s`
          ];
        } else if (solveFor === "f") {
          return [
            "Starting with the formula: f = v / λ",
            `Substitute the known values: f = ${v} / ${λ}`,
            `Calculate: f = ${(v / λ).toFixed(4)} Hz`
          ];
        } else if (solveFor === "λ") {
          return [
            "Starting with the formula: λ = v / f",
            `Substitute the known values: λ = ${v} / ${f}`,
            `Calculate: λ = ${(v / f).toFixed(4)} m`
          ];
        }
        return [];
      }
    },
    snellsLaw: {
      name: "Snell's Law",
      formula: "n1 * sin(θ1) = n2 * sin(θ2)",
      description: "Calculate the angle of refraction or refractive index",
      variables: {
        n1: "Refractive Index 1",
        θ1: "Angle of Incidence",
        n2: "Refractive Index 2",
        θ2: "Angle of Refraction"
      },
      units: {
        n1: "default",
        θ1: "rad",
        n2: "default",
        θ2: "rad"
      },
      unitTypes: {
        n1: "default",
        θ1: "angle",
        n2: "default",
        θ2: "angle"
      },
      category: "optics",
      solve: (values) => {
        const { n1, θ1, n2, θ2 } = values;
        if (θ2 === undefined) {
          return { θ2: Math.asin((n1 * Math.sin(θ1)) / n2) };
        } else if (θ1 === undefined) {
          return { θ1: Math.asin((n2 * Math.sin(θ2)) / n1) };
        } else if (n1 === undefined) {
          return { n1: (n2 * Math.sin(θ2)) / Math.sin(θ1) };
        } else if (n2 === undefined) {
          return { n2: (n1 * Math.sin(θ1)) / Math.sin(θ2) };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { n1, θ1, n2, θ2 } = values;
        if (solveFor === "θ2") {
          return [
            "Starting with the formula: θ2 = arcsin((n1 × sin(θ1)) / n2)",
            `Substitute the known values: θ2 = arcsin((${n1} × sin(${θ1})) / ${n2})`,
            `Calculate: θ2 = ${Math.asin((n1 * Math.sin(θ1)) / n2).toFixed(4)} rad`
          ];
        } else if (solveFor === "θ1") {
          return [
            "Starting with the formula: θ1 = arcsin((n2 × sin(θ2)) / n1)",
            `Substitute the known values: θ1 = arcsin((${n2} × sin(${θ2})) / ${n1})`,
            `Calculate: θ1 = ${Math.asin((n2 * Math.sin(θ2)) / n1).toFixed(4)} rad`
          ];
        } else if (solveFor === "n1") {
          return [
            "Starting with the formula: n1 = (n2 × sin(θ2)) / sin(θ1)",
            `Substitute the known values: n1 = (${n2} × sin(${θ2})) / sin(${θ1})`,
            `Calculate: n1 = ${((n2 * Math.sin(θ2)) / Math.sin(θ1)).toFixed(4)}`
          ];
        } else if (solveFor === "n2") {
          return [
            "Starting with the formula: n2 = (n1 × sin(θ1)) / sin(θ2)",
            `Substitute the known values: n2 = (${n1} × sin(${θ1})) / sin(${θ2})`,
            `Calculate: n2 = ${((n1 * Math.sin(θ1)) / Math.sin(θ2)).toFixed(4)}`
          ];
        }
        return [];
      }
    },
    lensEquation: {
      name: "Lens Equation",
      formula: "1/f = 1/v + 1/u",
      description: "Calculate focal length, image distance, or object distance for a lens",
      variables: {
        f: "Focal Length",
        v: "Image Distance",
        u: "Object Distance"
      },
      units: {
        f: "m",
        v: "m",
        u: "m"
      },
      unitTypes: {
        f: "length",
        v: "length",
        u: "length"
      },
      category: "optics",
      solve: (values) => {
        const { f, v, u } = values;
        if (f === undefined) {
          return { f: 1 / (1 / v + 1 / u) };
        } else if (v === undefined) {
          return { v: 1 / (1 / f - 1 / u) };
        } else if (u === undefined) {
          return { u: 1 / (1 / f - 1 / v) };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { f, v, u } = values;
        if (solveFor === "f") {
          return [
            "Starting with the formula: 1/f = 1/v + 1/u",
            `Substitute the known values: 1/f = 1/${v} + 1/${u}`,
            `Calculate: f = 1 / (1/${v} + 1/${u})`,
            `Calculate: f = ${(1 / (1 / v + 1 / u)).toFixed(4)} m`
          ];
        } else if (solveFor === "v") {
          return [
            "Starting with the formula: 1/v = 1/f - 1/u",
            `Substitute the known values: 1/v = 1/${f} - 1/${u}`,
            `Calculate: v = 1 / (1/${f} - 1/${u})`,
            `Calculate: v = ${(1 / (1 / f - 1 / u)).toFixed(4)} m`
          ];
        } else if (solveFor === "u") {
          return [
            "Starting with the formula: 1/u = 1/f - 1/v",
            `Substitute the known values: 1/u = 1/${f} - 1/${v}`,
            `Calculate: u = 1 / (1/${f} - 1/${v})`,
            `Calculate: u = ${(1 / (1 / f - 1 / v)).toFixed(4)} m`
          ];
        }
        return [];
      }
    },
    newtonsLawOfCooling: {
      name: "Newton's Law of Cooling",
      formula: "T(t) = T_env + (T_initial - T_env) * e^(-k*t)",
      description: "Calculate the temperature of an object over time",
      variables: {
        "T(t)": "Temperature at time t",
        "T_env": "Environmental Temperature",
        "T_initial": "Initial Temperature",
        k: "Cooling Constant",
        t: "Time"
      },
      units: {
        "T(t)": "K",
        "T_env": "K",
        "T_initial": "K",
        k: "1/s",
        t: "s"
      },
      unitTypes: {
        "T(t)": "default",
        "T_env": "default",
        "T_initial": "default",
        k: "frequency",
        t: "time"
      },
      category: "thermodynamics",
      solve: (values) => {
        const { "T(t)": Tt, "T_env": Tenv, "T_initial": Tinitial, k, t } = values;
        if (Tt === undefined) {
          return { "T(t)": Tenv + (Tinitial - Tenv) * Math.exp(-k * t) };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const { "T(t)": Tt, "T_env": Tenv, "T_initial": Tinitial, k, t } = values;
        if (solveFor === "T(t)") {
          return [
            "Starting with the formula: T(t) = T_env + (T_initial - T_env) * e^(-k*t)",
            `Substitute the known values: T(t) = ${Tenv} + (${Tinitial} - ${Tenv}) * e^(-${k}*${t})`,
            `Calculate: T(t) = ${Tenv + (Tinitial - Tenv) * Math.exp(-k * t)} K`
          ];
        }
        return [];
      }
    },
    einsteinMassEnergy: {
      name: "Einstein's Mass-Energy Equivalence",
      formula: "E = mc^2",
      description: "Calculate energy, mass, or the speed of light",
      variables: {
        E: "Energy",
        m: "Mass",
        c: "Speed of Light"
      },
      units: {
        E: "J",
        m: "kg",
        c: "299792458"
      },
      unitTypes: {
        E: "energy",
        m: "mass",
        c: "default"
      },
      category: "relativity",
      solve: (values) => {
        const c = 299792458; // Speed of light in m/s
        const { E, m } = values;
        if (E === undefined) {
          return { E: m * Math.pow(c, 2) };
        } else if (m === undefined) {
          return { m: E / Math.pow(c, 2) };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const c = 299792458; // Speed of light in m/s
        const { E, m } = values;
        if (solveFor === "E") {
          return [
            "Starting with the formula: E = m × c²",
            `Substitute the known values: E = ${m} × ${c}²`,
            `Calculate: E = ${(m * Math.pow(c, 2)).toFixed(4)} J`
          ];
        } else if (solveFor === "m") {
          return [
            "Starting with the formula: m = E / c²",
            `Substitute the known values: m = ${E} / ${c}²`,
            `Calculate: m = ${(E / Math.pow(c, 2)).toFixed(4)} kg`
          ];
        }
        return [];
      }
    },
    deBroglieWavelength: {
      name: "De Broglie Wavelength",
      formula: "λ = h / p",
      description: "Calculate the wavelength of a particle",
      variables: {
        λ: "Wavelength",
        h: "Planck's Constant",
        p: "Momentum"
      },
      units: {
        λ: "m",
        h: "6.626e-34",
        p: "kg·m/s"
      },
      unitTypes: {
        λ: "wavelength",
        h: "default",
        p: "momentum"
      },
      category: "quantum",
      solve: (values) => {
        const h = 6.626e-34; // Planck's constant in J·s
        const { λ, p } = values;
        if (λ === undefined) {
          return { λ: h / p };
        } else if (p === undefined) {
          return { p: h / λ };
        }
        return {};
      },
      steps: (values, solveFor) => {
        const h = 6.626e-34; // Planck's constant in J·s
        const { λ, p } = values;
        if (solveFor === "λ") {
          return [
            "Starting with the formula: λ = h / p",
            `Substitute the known values: λ = ${h} / ${p}`,
            `Calculate: λ = ${(h / p).toFixed(15)} m`
          ];
        } else if (solveFor === "p") {
          return [
            "Starting with the formula: p = h / λ",
            `Substitute the known values: p = ${h} / ${λ}`,
            `Calculate: p = ${(h / λ).toFixed(15)} kg·m/s`
          ];
        }
        return [];
      }
    }
  };

  useEffect(() => {
    if (formulas[selectedFormula]) {
      const variables = Object.keys(formulas[selectedFormula].variables);
      setSolveFor(variables[0]);
      
      const newValues: { [key: string]: string } = {};
      const newUnits: { [key: string]: string } = {};
      variables.forEach(variable => {
        newValues[variable] = "";
        newUnits[variable] = formulas[selectedFormula].units[variable];
      });
      setValues(newValues);
      setUnits(newUnits);
      
      setResult(null);
      setSteps([]);
    }
  }, [selectedFormula]);

  const calculateResult = () => {
    const formula = formulas[selectedFormula];
    if (!formula) return;
    
    const numericValues: { [key: string]: number } = {};
    
    const variables = Object.keys(formula.variables);
    for (const variable of variables) {
      if (variable !== solveFor && values[variable]) {
        try {
          const baseUnit = formula.units[variable];
          const selectedUnit = units[variable];
          
          if (baseUnit !== selectedUnit) {
            const convertedValue = convertUnit(parseFloat(values[variable]), selectedUnit, baseUnit, formula.unitTypes[variable]);
            numericValues[variable] = convertedValue;
          } else {
            numericValues[variable] = parseFloat(values[variable]);
          }
        } catch (error) {
          toast.error(`Invalid value for ${formula.variables[variable]}`);
          return;
        }
      }
    }
    
    const requiredVars = variables.filter(v => v !== solveFor);
    const missingVars = requiredVars.filter(v => numericValues[v] === undefined);
    
    if (missingVars.length > 0) {
      toast.error(`Please provide values for: ${missingVars.map(v => formula.variables[v]).join(", ")}`);
      return;
    }
    
    try {
      const calculatedResult = formula.solve(numericValues);
      setResult(calculatedResult);
      
      if (formula.steps) {
        const calculationSteps = formula.steps(numericValues, solveFor);
        setSteps(calculationSteps);
      } else {
        setSteps([]);
      }
      
      toast.success("Calculation completed successfully!");
    } catch (error) {
      toast.error("An error occurred during calculation. Please check your inputs.");
    }
  };

  const getFilteredFormulas = () => {
    return Object.entries(formulas)
      .filter(([_, formula]) => categoryFilter === "all" || formula.category === categoryFilter)
      .map(([key, formula]) => ({
        key,
        name: formula.name,
        formula: formula.formula,
        description: formula.description,
        category: formula.category
      }));
  };

  const filteredFormulas = getFilteredFormulas();

  return (
    <ToolLayout
      title="Physics Calculator"
      description="Calculate various physics formulas with step-by-step solutions"
      icon={<Calculator className="h-6 w-6 text-primary" />}
    >
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid grid-cols-2 md:w-[400px] mb-6">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Physics Formula</CardTitle>
                <CardDescription>Select a formula to calculate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="mechanics">Mechanics</SelectItem>
                      <SelectItem value="thermodynamics">Thermodynamics</SelectItem>
                      <SelectItem value="electromagnetism">Electromagnetism</SelectItem>
                      <SelectItem value="waves">Waves</SelectItem>
                      <SelectItem value="optics">Optics</SelectItem>
                      <SelectItem value="relativity">Relativity</SelectItem>
                      <SelectItem value="quantum">Quantum Physics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="formula">Formula</Label>
                  <Select value={selectedFormula} onValueChange={setSelectedFormula}>
                    <SelectTrigger id="formula">
                      <SelectValue placeholder="Select formula" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredFormulas.map((item) => (
                        <SelectItem key={item.key} value={item.key}>
                          {item.name} - {item.formula}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {formulas[selectedFormula] && (
                  <div className="bg-muted/30 p-4 rounded-md">
                    <h3 className="font-medium mb-1">{formulas[selectedFormula].name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{formulas[selectedFormula].description}</p>
                    <div className="font-mono text-base font-semibold">{formulas[selectedFormula].formula}</div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Calculation</CardTitle>
                <CardDescription>Enter values and solve for a specific variable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="solveFor">Solve For</Label>
                  <Select value={solveFor} onValueChange={setSolveFor}>
                    <SelectTrigger id="solveFor">
                      <SelectValue placeholder="Select variable to solve for" />
                    </SelectTrigger>
                    <SelectContent>
                      {formulas[selectedFormula] && Object.entries(formulas[selectedFormula].variables).map(([variable, name]) => (
                        <SelectItem key={variable} value={variable}>
                          {name} ({variable})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Input Values</h3>
                  {formulas[selectedFormula] && 
                    Object.entries(formulas[selectedFormula].variables)
                      .filter(([variable]) => variable !== solveFor)
                      .map(([variable, name]) => (
                        <div key={variable} className="grid grid-cols-3 gap-2 items-end">
                          <div className="col-span-2">
                            <Label htmlFor={`value-${variable}`} className="mb-1 block">
                              {name} ({variable})
                            </Label>
                            <Input
                              id={`value-${variable}`}
                              type="number"
                              step="any"
                              value={values[variable]}
                              onChange={(e) => setValues({...values, [variable]: e.target.value})}
                              placeholder={`Enter value for ${name}`}
                            />
                          </div>
                          <div>
                            <UnitConverterSelect
                              unitType={formulas[selectedFormula].unitTypes[variable]}
                              defaultUnit={formulas[selectedFormula].units[variable]}
                              value={values[variable]}
                              unit={units[variable] || ""}
                              onUnitChange={(value) => setUnits({...units, [variable]: value})}
                              onChange={(value) => setValues({...values, [variable]: value})}
                            />
                          </div>
                        </div>
                      ))
                  }
                </div>
                
                <Button className="w-full" onClick={calculateResult}>
                  Calculate
                </Button>
                
                {result && (
                  <div className="bg-primary/10 rounded-md p-4 mt-4 border border-primary/20">
                    <h3 className="font-medium mb-2">Result:</h3>
                    {Object.entries(result).map(([variable, value]) => (
                      <div key={variable} className="flex items-center">
                        <span className="font-semibold mr-2">
                          {formulas[selectedFormula].variables[variable]} ({variable}):
                        </span>
                        <span className="text-lg">
                          {typeof value === 'number' ? value.toFixed(4) : value}
                          {" "}
                          {formulas[selectedFormula].units[variable]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {steps.length > 0 && (
                  <div className="bg-muted/30 rounded-md p-4 mt-2">
                    <h3 className="font-medium mb-2">Step-by-step Solution:</h3>
                    <ol className="space-y-1 text-sm">
                      {steps.map((step, index) => (
                        <li key={index} className="flex gap-2">
                          <span>{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="formulas">
          <div className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">Physics Formulas</h2>
              <div className="ml-auto">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger id="category-filter" className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="mechanics">Mechanics</SelectItem>
                    <SelectItem value="thermodynamics">Thermodynamics</SelectItem>
                    <SelectItem value="electromagnetism">Electromagnetism</SelectItem>
                    <SelectItem value="waves">Waves</SelectItem>
                    <SelectItem value="optics">Optics</SelectItem>
                    <SelectItem value="relativity">Relativity</SelectItem>
                    <SelectItem value="quantum">Quantum Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Accordion type="multiple" className="w-full">
              {filteredFormulas.map((item) => (
                <AccordionItem key={item.key} value={item.key}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center text-left">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="font-mono text-sm text-muted-foreground">{item.formula}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 p-2">
                      <p className="text-sm">{item.description}</p>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <h4 className="text-sm font-medium mb-1">Variables:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
                          {Object.entries(formulas[item.key].variables).map(([symbol, name]) => (
                            <li key={symbol} className="flex items-center gap-2">
                              <span className="font-mono font-medium">{symbol}:</span>
                              <span>{name}</span>
                              <span className="text-muted-foreground ml-auto">
                                [{formulas[item.key].units[symbol]}]
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => {
                          setSelectedFormula(item.key);
                          document.getElementById("calculator-tab")?.click();
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Use this formula
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default PhysicsCalculator;
