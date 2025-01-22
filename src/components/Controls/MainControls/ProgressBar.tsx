import { MainContext } from "@/contexts";
import { formatPhoneNumber } from "@/utils";
import { Progress, Stack } from "@mantine/core";
import { useContext } from "react";

export function ProgressBar() {
    const { state } = useContext(MainContext)
    return (
        <Progress.Root size="xl">
            <Progress.Section value={state && state.selected && state.selected.date ? 25 : 0} color='pink'>
                <Progress.Label>{state && state.selected && state.selected.date}</Progress.Label>
            </Progress.Section>
            <Progress.Section value={state && state.donation && state.donation.length > 0 ? 25 : 0} color="blue">
                <Progress.Label>{state && state.donation && state.donation.length > 0 ? `${state.donation.length} item` : ''}</Progress.Label>
            </Progress.Section>
            <Progress.Section value={(state.page >= 4 || state && state.photos && state.photos.length > 0) ? 25 : 0} color='indigo'>
                <Progress.Label>{state.page >= 4 || state && state.photos && state.photos.length > 0 ? `${state.photos.length} photo` : ''}</Progress.Label>
            </Progress.Section>
            <Progress.Section value={state && state.donor ? 25 : 0} color='grape'>
                <Progress.Label>{state && state.donor ? formatPhoneNumber(state.phone) : ''}</Progress.Label>
            </Progress.Section>
        </Progress.Root>
    )
}
