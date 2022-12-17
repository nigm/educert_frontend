import Layout from "components/layouts/Layout"
import Head from "next/head"
import React, { useEffect } from "react"
import Collections from "./Collections"
import TestBlocks from "./TestBlocks"
import useTesting, { CollectionType, TestBlockType } from "./useTesting"

type TestingTemplateProps = {
    testBlocks: TestBlockType[],
    collections: CollectionType[],
}

const TestingTemplate = ({
    collections: initialCollections,
    testBlocks: initialTestBlocks
}: TestingTemplateProps) => {

    const {
        collections,
        setCollections,
        testBlocks,
        setTestBlocks
    } = useTesting()

    useEffect(() => {
        setCollections(initialCollections)
    }, [initialCollections])

    useEffect(() => {
        setTestBlocks(initialTestBlocks)
    }, [initialTestBlocks])

    return (
        <Layout>
            <Head>
                <title>
                    Тестирование
                </title>
            </Head>
            <div>
                <Collections
                    collections={collections}
                    setCollections={setCollections}
                />
            </div>
            <div>
                <TestBlocks

                />
            </div>
        </Layout>
    )
}

export default TestingTemplate