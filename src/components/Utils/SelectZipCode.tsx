import { Center, CloseButton, NumberInput, ScrollArea, SegmentedControl, Stack, Text, TextInput, Title } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import { useZipCode } from "./useZipCode";
import { Navigation } from "..";
import { IconCalendarWeek, IconList } from "@tabler/icons-react";
import { useState } from "react";

export function SelectZipCode({ open }: { open: boolean }) {
    const [viewMode, setViewMode] = useState('list')
    const { state, selectZip, selectDate, excludeDates, availableDates } = useZipCode()
    if (!open) return <></>
    return (
        <Stack p='xs'>
            <Title size={22} order={2}>Pickup Date</Title>
            <NumberInput
                autoFocus
                label="What is your zipcode?"
                value={(state && state.selected && state.selected.zip) ? state.selected.zip : ''}
                onChange={(e) => {
                    selectZip(e.toString())
                }}
                placeholder="Zipcode..."
                rightSection={
                    <CloseButton
                        aria-label="Clear zipcode"
                        onClick={() => {
                            selectZip(undefined)
                        }}
                        style={{ display: (state && state.selected && state.selected.zip) ? undefined : 'none' }}
                    />
                }
            />
            <Text size='xs' w={280} style={{ textAlign: 'justify' }}>{(state && state.selected && state.selected.note) ? state.selected.note : ''}</Text>
            <SegmentedControl aria-label={`${viewMode === 'list' ? 'Select Available Dates from the following list:' : 'Select Available Dates from the calendar:'}`}
                value={viewMode}
                onChange={(e) => setViewMode(e)}
                data={[
                    {
                        value: 'list', label: (
                            <Center style={{ gap: 10 }}>
                                <IconList />
                                <span >List View</span>
                            </Center>
                        )
                    },
                    {
                        value: 'calendar', label: (
                            <Center style={{ gap: 10 }}>
                                <IconCalendarWeek />
                                <span >Calender View</span>
                            </Center>
                        )
                    },
                ]}>

            </SegmentedControl>
            <Stack gap='xs' style={{
                marginTop: 10,
                border: (state && state.selected && state.selected.zip) ? '1px solid var(--mantine-color-gray-outline)' : ''
            }}>
                {viewMode === 'calendar' &&
                    <Calendar aria-label='Select Pickup Date from Calendar. Use up and down arrow keys to move through available dates.'
                        static={(state && state.selected && state.selected.zip) ? false : true}
                        minDate={dayjs(new Date()).add(2, 'day').toDate()}
                        maxDate={dayjs(new Date()).add(4, 'month').toDate()}
                        excludeDate={(date) => excludeDates(date)}
                        firstDayOfWeek={0}
                        ariaLabels={{ previousMonth: 'Previous Month', nextMonth: 'Next Month' }}
                        getDayProps={(date) => ({
                            selected: dayjs(date).isSame((state && state.selected && state.selected.date) ? state.selected.date : '', 'date'),
                            onClick: () => { selectDate(dayjs(date).format('YYYY-MM-DD')) },
                        })}
                    />
                }
                {viewMode === 'list' &&
                    <ScrollArea h={document.documentElement.clientHeight - 475} type="auto" >
                        <SegmentedControl
                            aria-label='Select Pickup Date from List. Use up and down array keys to move through available dates.'
                            orientation="vertical"
                            data={availableDates(state?.selected?.zip)}
                            onChange={(e) => selectDate(e)}
                        />
                    </ScrollArea>
                }
            </Stack>
            <Navigation first={true} enable={state && state.selected && state.selected.date !== undefined} />
        </Stack>
    )
}
