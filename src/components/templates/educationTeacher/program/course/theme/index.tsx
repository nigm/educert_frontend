import LoadingStatusWrapper, { LoadingStatusType } from "components/elements/LoadingStatusWrapper/LoadingStatusWrapper"
import Layout from "components/layouts/Layout"
import ItemList from "components/modules/itemList"
import UserExerciseResultInfo from "components/modules/userExerciseResultInfo"
import UserTestResultsInfo from "components/modules/userTestResultsInfo"
import { ThemeType } from "components/templates/courses/types"
import { SolvedTestType } from "components/templates/education/types"
import { UserProfileType } from "components/templates/users/types"
import { ENDPOINT_EDUCATION } from "constants/endpoints"
import Head from "next/head"
import { useRouter } from "next/router"
import React, { useState } from "react"
import utilStyles from "styles/utils.module.scss"
import axiosApi from "utils/axios"
import addNotification from "utils/notifications"
import styles from "./ThemeTemplate.module.scss"

type ThemeTemplateProps = {
    theme: ThemeType,
    themeStudents: UserProfileType[]
}

type AttemptType = {
    date: string
}

const ThemeTemplate = ({
    theme,
    themeStudents
}: ThemeTemplateProps) => {

    const router = useRouter()
    const [studentAttemptsStatus, setStudentAttemptsStatus] = useState<LoadingStatusType>(LoadingStatusType.LOADED)
    const [studentAttempts, setStudentAttempts] = useState<AttemptType[]>([])
    const [attempt, setAttempt] = useState<SolvedTestType>()
    const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>()

    const onStudentAttemptsClick = async (index: number) => {
        setStudentAttemptsStatus(LoadingStatusType.LOADING)
        setSelectedStudentIndex(index)
        const themeId = theme.themeId
        const studentId = themeStudents[index].userId
        axiosApi.get(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Student/${studentId}`)
            .then(res => {
                setStudentAttempts(res.data.map((el: string) => ({ date: el })))
                setStudentAttemptsStatus(LoadingStatusType.LOADED)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось загрузить спосок попыток студента:\n${err.code}` })
                setStudentAttemptsStatus(LoadingStatusType.LOAD_ERROR)
            })
    }

    const onAttemptInfoClick = (index: number) => {
        if (selectedStudentIndex === undefined) return
        const studentId = themeStudents[selectedStudentIndex].userId
        const themeId = theme.themeId
        const attemptDate = studentAttempts[index].date
        axiosApi.get(`${ENDPOINT_EDUCATION}/Themes/${themeId}/Student/${studentId}/Attemp/${attemptDate}`)
            .then(res => {
                setAttempt(res.data)
            })
            .catch(err => {
                addNotification({ type: "danger", title: "Ошибка", message: `Не удалось получить информацию о попытке:\n${err.code}` })
            })
    }

    return (
        <Layout>
            <Head>
                <title>{`Тема "${theme.title}"`}</title>
            </Head>
            <div className={utilStyles.title} >{`Тема "${theme.title}"`}</div>
            <div className={utilStyles.section}>
                <div className={utilStyles.section_title}>
                    Список студентов с темой
                </div>
                <div className={styles.lists_container}>
                    <ItemList
                        headers={[
                            {
                                title: "Фамилия",
                                field: "lastName"
                            },
                            {
                                title: "Имя",
                                field: "firstName"
                            },
                            {
                                title: "Отчество",
                                field: "secondName"
                            }
                        ]}
                        items={themeStudents}
                        itemControlButtons={() => [
                            {
                                title: "Попытки",
                                size: "small",
                                onClick: onStudentAttemptsClick
                            }
                        ]}
                        className={styles.students_list}
                    />
                    <LoadingStatusWrapper
                        status={studentAttemptsStatus}
                    >
                        <ItemList
                            headers={[
                                {
                                    title: "Дата попытки",
                                    field: "date"
                                }
                            ]}
                            items={studentAttempts}
                            customFieldsRendering={[
                                {
                                    fieldName: "date",
                                    render: (value) => new Date(value).toLocaleString()
                                }
                            ]}
                            itemControlButtons={() => [
                                {
                                    title: "Информация о попытке",
                                    stretchable: true,
                                    onClick: onAttemptInfoClick
                                }
                            ]}
                            className={styles.attempts_list}
                            scrollToBottomOnItemsUpdate
                        />
                    </LoadingStatusWrapper>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.section_title}>Информация о попытке</div>
                {attempt &&
                    <>
                        {attempt.userExercises && attempt.userExercises.length > 0 &&
                            <UserExerciseResultInfo
                                {...{
                                    mode: "teacher",
                                    solvedTest: attempt
                                }}
                            />
                        }
                        {attempt.userQuestions && attempt.userQuestions.length > 0 &&
                            <UserTestResultsInfo
                                {...{
                                    mode: "teacher",
                                    solvedTest: attempt
                                }}
                            />
                        }
                    </>
                }
            </div>
        </Layout >
    )
}

export default ThemeTemplate