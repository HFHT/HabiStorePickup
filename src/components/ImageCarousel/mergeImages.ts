import { SchedulerDonationType } from "@/contexts/ScheduleContext/useGetApptsforDay"

export const mergeImages = (donation: SchedulerDonationType | undefined | null) => {
    console.log('mergeImages', donation?.pickup.imgs, donation?.delivery.imgs)
    if (donation === undefined || donation === null) return []
    console.log([...donation!.pickup.imgs, ...donation!.delivery.imgs])
    const proof = donation.proof ? donation.proof : []
    return [...donation.pickup.imgs, ...donation.delivery.imgs, ...proof]
}