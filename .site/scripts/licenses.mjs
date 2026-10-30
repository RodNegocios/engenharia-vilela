import { readFile, writeFile, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const sections = [
  [
    "GSAP / ScrollTrigger 3.15.0",
    "Copyright 2008-2026, GreenSock. All rights reserved.\nStandard no-charge license, including commercial websites: https://gsap.com/standard-license\nSource: https://github.com/greensock/GSAP\nLicense and copyright notices are retained in the distributed library.",
  ],
];
for (const [name, file] of [
  ["Lenis — MIT", "node_modules/lenis/LICENSE"],
  [
    "Manrope — SIL Open Font License 1.1",
    "node_modules/@fontsource-variable/manrope/LICENSE",
  ],
  [
    "Cormorant Garamond — SIL Open Font License 1.1",
    "node_modules/@fontsource/cormorant-garamond/LICENSE",
  ],
  [
    "React Bits — animation patterns adapted for this website",
    "docs/REACT-BITS-LICENSE.md",
  ],
])
  sections.push([name, await readFile(new URL(file, root), "utf8")]);
await mkdir(new URL("public/assets/", root), { recursive: true });
await writeFile(
  new URL("public/assets/third-party-licenses.txt", root),
  sections
    .map(([name, license]) => `${name}\n${"=".repeat(name.length)}\n${license}`)
    .join("\n\n"),
);
