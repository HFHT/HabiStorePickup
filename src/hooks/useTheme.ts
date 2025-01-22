import { useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

export function useTheme() {
    const theme = useMantineTheme()
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`)
    const dark = useMediaQuery(`(prefers-color-scheme: dark)`)

    return { theme, mobile, dark } as const
}
