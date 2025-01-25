import 'add-to-calendar-button';

export function AddToCalendar({ name, buttonsList = false, date, description }: { name: string, buttonsList?: boolean, date: string | undefined, description: { _id: string, template: string } | undefined }) {
    if (!date || !description) return <></>
    return (
        <add-to-calendar-button
            name={name}
            description={description.template}
            size='1'
            startDate={date}
            startTime="09:00"
            endTime="16:00"
            timeZone="America/Phoenix"
            options="'Apple','Google','iCal','Outlook.com','Yahoo','Microsoft365','MicrosoftTeams'"
            buttonsList={buttonsList}
            buttonStyle="round"
            lightMode="system"
        ></add-to-calendar-button>
    )
}
