import { Navigation } from "@/components/Controls";
import { MainContext } from "@/contexts";
import { ItemListType, useOpenAI } from "@/hooks";
import { uniqueKey } from "@/utils";
import { Button, Grid, NumberInput, Stack, Text, Textarea, TextInput, Title, Tooltip } from "@mantine/core";
import { IconCirclePlus, IconTrash } from "@tabler/icons-react";
import { useContext, useState } from "react";

export function Items({ open }: { open: boolean }) {
  const { dispatch } = useContext(MainContext)
  const { itemList, addToList, removeFromList, getOpenAI, haveResponse } = useOpenAI()
  if (!open) return <></>
  return (
    <Stack gap='xs' p='xs'>
      <Title size={22} order={2}>Items to be donated</Title>
      <AITextArea open={!haveResponse} />
      <EditList open={haveResponse} itemList={itemList ? itemList : []} />
      <Navigation first={false} enable={haveResponse} last={!haveResponse} callBack={() => {
        dispatch({ type: 'setDonation', payload: itemList ? [...itemList] : [] })
      }} />
    </Stack>
  )
  function AITextArea({ open }: { open: boolean }) {
    const [donatedItems, setDonatedItems] = useState<string>('')
    if (!open) return <></>
    return (
      <>
        <Text size='xs'>Provide a list of the items and the quantity of each item, for instance: 1 table, 4 chairs<br />Then press the <b><i>Verify List</i></b> button.</Text>
        <Textarea autoFocus label='List of Items' autosize minRows={6} placeholder='1 table, 4 chairs' value={donatedItems}
          aria-label='Provide a list of the items and the quantity of each item, for instance: 1 table, 4 chairs. Then press the Verify List button.'
          onChange={(e) => setDonatedItems(e.currentTarget.value)}
        />
        <Button onClick={() => getOpenAI(donatedItems)}>Verify List</Button>
      </>
    )
  }
  function EditList({ open, itemList }: { open: boolean, itemList: ItemListType[] }) {
    const [newItem, setNewItem] = useState({ qty: 0, prod: '' })
    if (!open) return <></>
    return (
      <>
        <Text size='sm' >Make any adjustments to this list.</Text>
        <div autoFocus aria-label='Make any adjustments to the following list.'>
          {
            itemList.map((si, idx) => (
              <Grid gutter='xs' key={uniqueKey()}>
                <Grid.Col span={2} pt={3} pb={3}>
                  <NumberInput value={si.qty} size='xs' aria-label='Quantity' hideControls onChange={(e) => console.log(e)} />
                </Grid.Col>
                <Grid.Col span={8} pt={3} pb={3} aria-label='Item'>
                  <TextInput size='xs' value={si.prod} onChange={(e) => console.log(e)} />
                </Grid.Col>
                <Grid.Col span={2} pt={3} pb={3}>
                  <Tooltip label='Remove from list.'>
                    <Button variant='subtle' color='gray' title='Remove from list.' aria-label={`Remove ${si.prod} from list.`}
                      leftSection={<IconTrash />}
                      onClick={() => { removeFromList(idx) }}
                    >
                    </Button>
                  </Tooltip>
                </Grid.Col>
              </Grid>
            ))
          }
        </div>
        <Grid gutter='xs' mt='xs'>
          <Grid.Col span={2} pt={0} pb={0}>
            <NumberInput value={newItem.qty?.toString()} size='xs' aria-label='Add quantity of:' hideControls onChange={(e) => setNewItem({ ...newItem, qty: Number(e) })} />
          </Grid.Col>
          <Grid.Col span={8} pt={0} pb={0}>
            <Textarea value={newItem.prod} size='xs' rows={1} autosize aria-label='Add item:' placeholder='Add pickup item...' onChange={(e) => setNewItem({ ...newItem, prod: e.currentTarget.value })} />
          </Grid.Col>
          <Grid.Col span={2} pt={0} pb={0}>
            <Tooltip label='Add item.'>
              <Button variant='subtle' color='gray' disabled={newItem.qty === 0 || newItem.prod.length < 3}
                aria-label='Add item to list.'
                title='Add item.'
                leftSection={<IconCirclePlus />}
                onClick={() => { addToList({ qty: newItem.qty, prod: newItem.prod }) }}
              >
              </Button>
            </Tooltip>
          </Grid.Col>
        </Grid>
      </>
    )
  }
}
