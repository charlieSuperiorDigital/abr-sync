export default function UserProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full">
            {children}
        </div>
    )
}
