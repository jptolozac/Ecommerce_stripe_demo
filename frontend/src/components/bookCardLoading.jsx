export function BookCardLoading() {
    return (
        <div className="w-[256px] book-item animate-pulse">
            <img
                src={''}
                width={207}
                className="mx-auto my-4 rounded-xl shadow-xl"
            />
            <div className="w-[207px] h-[250px] bg-gray-200 mx-auto my-4 rounded-xl shadow-xl"></div>
            <div className="w-[226px] mx-auto text-lg">
                <div className="border-b px-2 font-semibold">
                    <div className="w-full h-4 bg-gray-200 rounded-md mb-1"></div>
                </div>
                <div className="px-2">
                    <div className="w-full h-4 bg-gray-200 rounded-md mb-1"></div>
                </div>
                <div className="mx-2 mt-6 mb-2 text-2xl font-semibold text-dark-red">
                    <div className="w-full h-8 bg-gray-200 rounded-md mb-1"></div>
                </div>
            </div>
        </div>
    )
}