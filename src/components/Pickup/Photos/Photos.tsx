import { ImageCarousel } from "@/components"
import { Navigation } from "@/components/Controls"
import { useImages } from "@/components/ImageCarousel"
import { MainContext } from "@/contexts"
import { useTheme } from "@/hooks"
import { Image, Modal, Stack, Title } from "@mantine/core"
import { useContext } from "react"

export function Photos({ open }: { open: boolean }) {
  const { dispatch } = useContext(MainContext)
  const { mobile } = useTheme()
  const { imageList, imageAction, imagePreview } = useImages()

  if (!open) return <></>

  return (
    <>
      <Stack gap='xs' p='xs' style={{ minWidth: mobile ? document.documentElement.clientWidth-20 : document.documentElement.clientWidth/2 }}>
        <Title size={22} order={2}>Upload photos</Title>
        <ImageCarousel
          mt='xs'
          images={imageList ? imageList : []}
          callBack={(e: any) => {
            imageAction(e)
          }}
          slideSize={{ base: '20%', sm: '20%' }}
          align="start"
          slideGap={{ base: 4, sm: 2 }}
          withControls={true}
          open={true}
          hasChanged={false}
        />
        <Navigation first={false} enable={true} callBack={() => {
          dispatch({ type: 'setPhotos', payload: imageList ? [...imageList] : [] })

        }} />
      </Stack>
      <Modal opened={imagePreview !== undefined} title='Image Viewer'
        onClose={() => {
          imageAction({ cmd: 'CloseView', url: '', idx: 0, img: [] })
        }}
      >
        <Image src={imagePreview} fallbackSrc="https://hfhtdev.blob.core.windows.net/production/brokenImage.jpg" />
      </Modal>
    </>
  )
}
