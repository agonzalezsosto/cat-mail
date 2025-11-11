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
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Email sent successfully!" });
        setEmail("");
        setMessage("");
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send email" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box as="form" onSubmit={handleSubmit}>
        <VStack gap={6} align="stretch">
          <Heading size="lg">Contact Form</Heading>

          {status && (
            <Box
              p={4}
              borderRadius="md"
              bg={status.type === "success" ? "green.100" : "red.100"}
              color={status.type === "success" ? "green.800" : "red.800"}
            >
              {status.message}
            </Box>
          )}

          <Stack gap={2}>
            <Text fontWeight="medium">To Email</Text>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Recipient email address"
              required
              disabled={loading}
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
              disabled={loading}
            />
          </Stack>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default App;
