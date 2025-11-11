import { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Input,
  Textarea,
  Button,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

function App() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, message });
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack gap={6} align="stretch">
          <Heading size="lg">Contact Form</Heading>

          <Stack gap={2}>
            <Text fontWeight="medium">Email Address</Text>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </Stack>

          <Stack gap={2}>
            <Text fontWeight="medium">Message</Text>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
              rows={6}
              required
            />
          </Stack>

          <Button type="submit" colorScheme="blue" size="lg">
            Submit
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default App;
