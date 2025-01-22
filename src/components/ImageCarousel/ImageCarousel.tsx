import '@mantine/carousel/styles.css';
import { Carousel } from '@mantine/carousel';
import { Button, Image, Menu } from '@mantine/core';
import { IconArrowBack, IconEye, IconPhotoX } from '@tabler/icons-react';
import classes from './ImageCarousel.module.css'
import { InputImages } from './InputImages';

interface ImageCarouselInterface {
    images: ImagesType[] | []
    callBack: Function
    hasChanged: boolean
    height?: number
    open?: boolean
    slideSize?: any
    slideGap?: any
    align?: any
    controlsOffset?: any
    controlSize?: any
    disabled?: boolean
    withIndicators?: boolean
    withControls?: boolean
    mb?: any
    mt?: any
    ml?: any
}
export type ImagesType = {
    name: string
    uniqueName?: string | undefined
    url: string
    blob: any
}
export function ImageCarousel({ images, callBack, hasChanged, slideSize, slideGap, align, controlSize, controlsOffset, withIndicators, withControls, open = true, height, mb = 0, mt = 0, ml = 0, disabled = false }: ImageCarouselInterface) {

    if (!open) return
    const theSelection = (theAction: any) => {
        console.log('ImageCarousel-theSelection', theAction)
        callBack(theAction)
    }
    const slides = images.map((image: ImagesType, idx: number) => (
        <Carousel.Slide key={`${image.url}${idx}`}>
            <Menu shadow="md" width={200} trigger="click" openDelay={100} closeDelay={0} closeOnItemClick >
                <Menu.Target>
                    <Image src={image.url} fallbackSrc={'https://hfhtdev.blob.core.windows.net/production/brokenImage.jpg'} />
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Actions...</Menu.Label>
                    <div onClick={() => theSelection({ cmd: 'View', url: image.url })}>
                        <Menu.Item leftSection={<IconEye style={{ width: 'rem(14)', height: 'rem(14)' }} />}>
                            View
                        </Menu.Item>
                    </div>
                    {!disabled &&
                        <div onClick={() => theSelection({ cmd: 'Delete', img: [{ ...image }], idx: idx })}>
                            <Menu.Item leftSection={<IconPhotoX style={{ width: 'rem(14)', height: 'rem(14)' }} />}>
                                Remove
                            </Menu.Item>
                        </div>
                    }
                </Menu.Dropdown>
            </Menu >

        </Carousel.Slide >
    ))
    return (
        <>
            <Carousel height={height} mt={mt} mb={mb} ml={ml} slideSize={slideSize} align={align} slideGap={slideGap} controlsOffset={controlsOffset} controlSize={controlSize} withIndicators={withIndicators} withControls={withControls} classNames={classes}>
                {slides}
            </Carousel>
            {!disabled &&
                <InputImages images={images} setImages={(e: any) => theSelection({ cmd: 'Add', img: e, idx: undefined })} mode='donation' />
            }
            {hasChanged && !disabled &&
                <Button variant="light" ml='sm' size='sm'
                    leftSection={<IconArrowBack style={{ width: 'rem(14)', height: 'rem(14)' }} />}
                    onClick={() => theSelection({ cmd: 'Reset' })}
                >Undo</Button>
            }
        </>
    );
}