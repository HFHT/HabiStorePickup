import { AcceptableItems, Confirmation, ConstituentLookup, ContactInfo, Items, Photos, SelectZipCode, ThankYou } from '@/components';
import { MainContext } from '@/contexts';
import { Box, Flex, Grid } from '@mantine/core';
import { useContext } from 'react';

interface HomePageType {
  open: boolean
}
export function HomePage({ open }: HomePageType) {
  if (!open) return <></>
  const { state } = useContext(MainContext)
  if (!state) return <>Loading...</>
  return (
    <>
      <Box pos='relative' top={25}>
        <Grid grow justify="space-around" align="center" pt='xs' pb='xl' >
          <Flex style={{ flexBasis: 'fit-content' }} bg='var(--mantine-color-body)' p={3}>

            <SelectZipCode open={state.page === 0} />
            <AcceptableItems open={state.page === 1} />
            <Items open={state.page === 2} />
            <Photos open={state.page === 3} />
            <ConstituentLookup open={state.page === 4} />
            <ContactInfo open={state.page === 5} />
            <Confirmation open={state.page === 6} />
            <ThankYou open={state.page === 7} />
          </Flex>
        </Grid>
      </Box>
    </>
  );
}
