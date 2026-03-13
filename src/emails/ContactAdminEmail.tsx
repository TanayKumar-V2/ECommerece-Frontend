import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ContactAdminEmailProps {
  name: string;
  email: string;
  phone: string;
  query: string;
}

export const ContactAdminEmail = ({
  name,
  email,
  phone,
  query,
}: ContactAdminEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Inquiry from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Section style={section}>
            <Text style={text}><strong>Name:</strong> {name}</Text>
            <Text style={text}><strong>Email:</strong> {email}</Text>
            <Text style={text}><strong>Phone:</strong> {phone}</Text>
            <Hr style={hr} />
            <Text style={text}><strong>Message:</strong></Text>
            <Text style={messageText}>{query}</Text>
          </Section>
          <Text style={footer}>
            Viraasat — Customer Support Inquiries
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ContactAdminEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0 48px',
};

const section = {
  padding: '0 48px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const messageText = {
  ...text,
  padding: '12px',
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  marginTop: '20px',
};
