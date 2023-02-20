import Head from "next/head";
import { useState } from "react";
import {
  Textarea,
  Heading,
  Container,
  Select,
  Text,
  Link,
  Button,
  Center,
  Alert,
  AlertIcon,
  Spinner,
  AlertDescription,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const typesOfExcuses = {
  medical: "Vague medical issue",
  familiar: "Random familiar celebration",
  overlapping: "Overlapping with other event",
};

export default function Home() {
  const [generatedExcuses, setGeneratedExcuses] = useState("");
  const [excuseType, setExcuseType] = useState("medical");
  const [excuseInput, setExcuseInput] = useState("");
  const [disableInput, setDisableInput] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);

  const generateExcuse = async (e) => {
    e.preventDefault();
    setGeneratedExcuses("");
    setDisableInput(true);
    const prompt = `Generate one excuse for "${excuseInput}". Make sure each generated excuse is at least 6 words and at max 20 words and base 
    them on this context: ${excuseType}`;
    const response = await fetch("/api/generateExcuse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
  
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  
    const data = response.body;
    if (!data) {
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
  
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedExcuses((prev) => prev + chunkValue);
    }
  
    setDisableInput(false);
  };

  return (
    <>
      <Head>
        <title>Excuse Generator</title>
        <meta
          name="description"
          content="Generate an excuse for any situation"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Center h="75vh">
          <Container maxW="md" centerContent>
            <Heading as="h1" pt={5} pb={3}>
              Excuse Generator
            </Heading>
            <Text fontSize="2xl" pb={2}>
              Generate an excuse for any situation
            </Text>
            <Textarea
              isDisabled={disableInput}
              value={excuseInput}
              onChange={(e) => {
                setExcuseInput(e.target.value);
              }}
              isInvalid={invalidForm}
              pb={2}
              placeholder="What do you need an excuse for?"
            />
            <Select
              isDisabled={disableInput}
              isInvalid={invalidForm}
              onChange={(e) => setExcuseType(e.target.value)}
              value={excuseType}
              pb={3}
              pt={2}
            >
              <option value="medical">{typesOfExcuses.medical}</option>
              <option value="familiar">{typesOfExcuses.familiar}</option>
              <option value="overlapping">{typesOfExcuses.overlapping}</option>
            </Select>
            {invalidForm && (
              <Alert status="error" pb={2} borderRadius="lg">
                <AlertIcon />
                <AlertDescription>
                  Your input needs to be at least 10 characters.
                </AlertDescription>
              </Alert>
            )}
            <Button
              mt={3}
              mb={6}
              isDisabled={disableInput}
              onClick={(e) => {
                if (excuseInput.length < 10) {
                  setInvalidForm(true);
                } else {
                  setInvalidForm(false);
                  generateExcuse(e);
                }
              }}
              colorScheme="teal"
              size="lg"
            >
              Generate Excuse
            </Button>
            <Heading as="h2" size="md">
              Your generated excuse:
            </Heading>
            <Container
              borderRadius="lg"
              maxW="md"
              bg="gray.100"
              color="black"
              mt={3}
              pt={3}
              centerContent
              pb={3}
            >
              {invalidForm ? <Spinner /> : generatedExcuses}
            </Container>
          </Container>
        </Center>
      </main>
      <footer>
        <Container as="footer" maxW="md" pt={8} centerContent>
          <Text>
            Excuse Generator by{" "}
            <Link
              isExternal
              color="teal.500"
              href="htttps://twitter/com/mcocirio"
            >
              Mariano Cocirio <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
          <Text>
            Source code on{" "}
            <Link
              color="teal.500"
              isExternal
              href="https://github.com/MFCo/excuse-generator"
            >
              GitHub <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
        </Container>
      </footer>
    </>
  );
}
