'use client'

import { FormEvent, useState } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'

import styles from './index.module.css'

export const metadata: Metadata = {
    title: 'OpenAI Nextjs 13 Quickstart',
    description: 'OpenAI Nextjs 13 Quickstart...',
}

export default function Home() {
    const [animalInput, setAnimalInput] = useState('')
    const [result, setResult] = useState('')

    const [error, setError] = useState('')

    const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!animalInput) {
            console.log('please input your pet type.')
            setError('please input your pet type.')
            return
        }

        const bodyObj: AnimalType = { animal: animalInput }
        try {
            const response = await fetch('/api/generate-names', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyObj),
            })

            const data = await response.json()
            if (response.status !== 200) {
                throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                )
            }

            setResult(data.result)
            setAnimalInput('')
        } catch (error: any) {
            // Consider implementing your own error handling logic here
            console.error(error)
            setError(error.message)
        }
    }

    return (
        <div>
            <main className={styles.main}>
                <Image
                    src="/images/dog.png"
                    className={styles.icon}
                    alt="Picture of the dog"
                    width={100}
                    height={100}
                />

                <h3>Name my pet</h3>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleOnSubmit}>
                    <input
                        type="text"
                        name="animal"
                        placeholder="Enter an animal"
                        value={animalInput}
                        onChange={(e) => setAnimalInput(e.target.value)}
                    />

                    <input type="submit" value="Generate names" />
                </form>

                {result && <div className={styles.result}>{result}</div>}
            </main>
        </div>
    )
}
