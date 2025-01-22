import { SettingsRoutes } from "../types"

export function calculateDowPickups(routes: SettingsRoutes) {
    // Calculate the total number of pickups (and deliveries) for each day of the week.
    const trucks = Object.keys(routes.trucks)
    let totalPickups = [0, 0, 0, 0, 0, 0, 0]
    trucks.forEach((tKey: string) => {
        totalPickups = routes.trucks[tKey].pickup.loadsize.map((num: number, idx: number) => num + totalPickups[idx])
    })
    return totalPickups
}
