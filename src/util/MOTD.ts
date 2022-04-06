export function MOTD(config: { version: string }): void {
  const color_beam = "%c▓%c▓%c▓%c▓%c▓%c▓%c▓%c▓%c▓%c▓%c▓▓▓%c"
  const font = "font-family: monospace;"
  const bold = "font-weight: bolder;"
  const underline = "text-decoration: underline;"
  const lines = [
    "#3671CC", "#3061D1", "#2C52D5", "#2A4CD6", "#2A40DD",
    "#2635E0", "#2A26E5", "#2B1CEA", "#3118F0", "#3004F2"
  ].map(c => `color: ${c}; ${font}`)
  const normal = `color: inherit; ${font}`
  console.log(`%c
   ░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▒░%c
 ░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░%c
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    %c▓▓%c
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    %c▓▓%c
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    %c▓▓▓▓▓▓.   ▓▓▓▓     ▓▓▓▓.   ▓▓ .▓▓▓..▓▓▓.%c
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    %c▓▓   ▓▓  ▓▓   ▓▓  ▓▓   ▓▓  ▓▓▓   ▓▓   ▓▓%c
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    %c▓▓   ▓▓  ▓▓▓▓"    ▓▓   ▓▓  ▓▓    ▓▓   ▓▓%c
 ▓▓▓▓${color_beam}▓▓▓▓    %c▓▓▓▓▓"    ▓▓▓▓▓   '▓▓▓▓▓▓  ▓▓    ▓▓   ▓▓%c
 ░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░%c
   ░▒▓▓▓▓▓▓▓▓▓▓▓▓▓▒░
%c
`,
    lines[0], lines[1],
    lines[2], normal,
    lines[3], normal,
    lines[4], normal,
    lines[5], normal,
    lines[6], normal,
    lines[7],
    `color: #4E44EE; ${font}`,
    `color: #6A61F1; ${font}`,
    `color: #8778F2; ${font}`,
    `color: #A392F3; ${font}`,
    `color: #C9A0E2; ${font}`,
    `color: #e2b5a0; ${font}`,
    `color: #eebf5e; ${font}`,
    `color: #f4c953; ${font}`,
    `color: #FDD452; ${font}`,
    `color: #ffdf3d; ${font}`,
    `color: #FFE766; ${font}`,
    lines[7], normal,
    lines[8], lines[9],
    normal
  )
  console.log("%cVersion%c", `${bold}${underline}`, normal, config.version)
}
