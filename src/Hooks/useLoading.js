import { useState } from "react";

export function useLoading(callback) {
    const [isLoading, setIsLoading] = useState(false)

    const dbStart = async () => {
        try {
            setIsLoading(true)
            await callback()
        }
        catch (err) {
            console.log(err.message)
        }
        finally {
            setIsLoading(false)
        }
    }
    return [dbStart, isLoading]
}

export default useLoading;