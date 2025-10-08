import { Navigation } from "@/components/Controls"
import { MainContext } from "@/contexts"
import { useTheme } from "@/hooks"
import { uniqueKey } from "@/utils"
import { Divider, ScrollArea, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core"
import { useContext } from "react"

export function AcceptableItems({ open }: { open: boolean }) {
  const { notAcceptedItems } = useContext(MainContext)
  const { mobile } = useTheme()
  if (!open) return <></>
  return (
    <Stack gap='xs' pt={6} pb={6} pl={'lg'} pr={'lg'} style={{ width: mobile ? '20rem' : '' }}>
      <Title size={22} order={2} autoFocus
      // aria-label={`We do not accept the following items: ${notAcceptedItems.join(', ')}`}
      >Acceptable Items</Title>
      <Text>We do <u>not</u> accept:</Text>
      <ScrollArea h={mobile ? document.documentElement.clientHeight - 260 : ''} type="auto" mb='sm' >
        <SimpleGrid cols={mobile ? 1 : 2} spacing="xs" verticalSpacing="xs" aria-label={`We do not accept the following items: ${notAcceptedItems.join(', ')}`}>
          <Text size='md' fw={700}>Box Springs</Text>
          {notAcceptedItems.map((im) => (
            <Text key={uniqueKey()} size='sm'>{im}</Text>
          ))}
        </SimpleGrid>
        <Divider mt='md' />
        <Title size={22} order={3}>Requires prior approval</Title>
        <Text>Please include photos:</Text>
        <SimpleGrid cols={mobile ? 1 : 2} spacing="xs" verticalSpacing="xs" aria-label={`These items need prior approval, include photos: Bed frames, Entertainment Centers, Large Desks}`}>
          {['Bed frames', 'Large Desks', 'Entertainment Centers'].map((im) => (
            <Text key={uniqueKey()} size='sm'>{im}</Text>
          ))}
        </SimpleGrid>
      </ScrollArea>
      <Navigation first={false} enable={true} />
    </Stack>
  )
}
