import TestTemplate from "components/templates/education/program/course/theme/test"
import { SolvedTestType } from "components/templates/education/types"
import LoadingErrorTemplate from "components/templates/loadingError"
import UnauthorizedTemplate from "components/templates/unauthorized"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { userSelector } from "store/userSlice"
import axiosApi from "utils/axios"

const Test = () => {

    const user = useSelector(userSelector)
    const router = useRouter()
    const [test, setTest] = useState<SolvedTestType>()
    const [success, setSuccess] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (user.authorized) {
            const { programId, courseId, themeId } = router.query
            const requestUrl = `${ENDPOINT_EDUCATION}/Programs/${programId}/Courses/${courseId}/Themes/${themeId}/TestBlock/Active`
            axiosApi.get(requestUrl)
                .then(res => {
                    setSuccess(true)
                    setTest(res.data)
                })
                .catch(err => {
                    setSuccess(false)
                    setError(err.code)
                })
        }
    }, [user.authorized, router.query])


    return (
        <>
            {user.authorized ?
                <>
                    {success && test ?
                        <TestTemplate
                            test={test}
                        /> :
                        <LoadingErrorTemplate
                            error={error}
                        />
                    }
                </> :
                <UnauthorizedTemplate />

            }
        </>
    )
}

export default Test