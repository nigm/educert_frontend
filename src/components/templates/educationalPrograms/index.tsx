import React, { useEffect } from "react"
import Layout from "components/layouts/Layout"
import Head from "next/head"
import ItemList from "components/modules/itemList"
import { CourseType } from "../courses/useCourses"
import useEducationalPrograms from "./useEducationalPrograms"

export type EducationalProgramType = {
    programId: string,
    createDate: string,
    creatorId: string,
    description: string,
    programCourses: CourseType[]
    programCriteria: any
    title: string,
    commonFiles: any[],
    userPrograms: any[]
}

type EducationalProgramsTemplateProps = {
    educationalPrograms: EducationalProgramType[]
}

const EducationalProgramsTemplate = ({
    educationalPrograms
}: EducationalProgramsTemplateProps) => {

    const {
        programs,
        setPrograms,
        onEducationalProgramAddClick,
        onEducationalProgramEditClick,
        onEducationalProgramDeleteClick,
        onEducationalProgramCoursesClick,
        onEducationalProgramStudentsClick
    } = useEducationalPrograms()

    useEffect(() => {
        setPrograms(educationalPrograms)
    }, [educationalPrograms])

    return (
        <Layout>
            <Head>
                <title>Образовательные программы</title>
            </Head>
            <ItemList
                headers={[
                    {
                        title: "Название",
                        field: "title"
                    },
                    {
                        title: "Описание",
                        field: "description"
                    }
                ]}
                items={programs}
                itemControlButtons={() => [
                    {
                        title: "Редактировать",
                        onClick: onEducationalProgramEditClick,
                        size: "small",
                        stretchable: true
                    },
                    {
                        title: "Удалить",
                        onClick: onEducationalProgramDeleteClick,
                        size: "small",
                    },
                    {
                        title: "Курсы",
                        onClick: onEducationalProgramCoursesClick,
                        stretchable: true
                    },
                    {
                        title: "Обучающиеся",
                        onClick: onEducationalProgramStudentsClick,
                        stretchable: true
                    }
                ]}
                controlButtonsBottom={[
                    {
                        title: "Добавить",
                        onClick: onEducationalProgramAddClick,
                        size: "small"
                    }
                ]}
            />
        </Layout>
    )
}

export default EducationalProgramsTemplate