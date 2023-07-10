import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// POST http://localhost:3000/api/generate-names
export const POST = async (request: Request) => {
    draftMode().enable()

    const data: AnimalType = await request.json() // post request body: { animal: 'pig' }
    console.log(data)

    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: generatePrompt(data.animal),
        temperature: 0.6,
    })

    return NextResponse.json({ result: completion.data.choices[0].text })
}

function generatePrompt(animal: string) {
    const capitalizedAnimal =
        animal[0].toUpperCase() + animal.slice(1).toLowerCase() // Pig

    return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`
}

/*
POST http://localhost:3000/api/generate-names

request body:
{animal: "pig"}

response body:
{"result":" Super Spot, Mighty Mutt, Power Pup"}
*/

// https://nextjs.org/docs/app/building-your-application/routing/router-handlers
// Streaming is commonly used in combination with Large Language Models (LLMs), such an OpenAI, for AI-generated content.

/*
import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
 
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)
 
export const runtime = 'edge'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    stream: true,
    temperature: 0.6,
    prompt: 'What is Next.js?',
  })
 
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
*/
