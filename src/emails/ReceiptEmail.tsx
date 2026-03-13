import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

export interface ReceiptEmailProps {
  orderId: string;
  customerName: string;
  paymentId: string;
  items: {
    title: string;
    quantity: number;
    size: string;
    color: string;
    price?: number;
  }[];
  totalAmount: number;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

const BRAND_CREAM = '#F5E6DA';
const BRAND_BROWN = '#3B2F2F';
const BRAND_BEIGE = '#E8CCAE';
const BRAND_MID = '#8C6E5D';

export default function ReceiptEmail({
  orderId,
  customerName,
  paymentId,
  items,
  totalAmount,
  shippingAddress,
}: ReceiptEmailProps) {
  const displayId = orderId.slice(-8).toUpperCase();
  const formattedTotal = `₹${totalAmount.toLocaleString('en-IN')}`;

  return (
    <Html>
      <Head />
      <Preview>Your Viraasat order #{displayId} is confirmed — thank you!</Preview>
      <Body style={body}>
        {/* ── Header ── */}
        <Container style={container}>
          <Section style={header}>
            <Heading style={brandName}>VIRAASAT</Heading>
            <Text style={brandTagline}>Rooted in craft. Worn with pride.</Text>
          </Section>

          {/* ── Hero band ── */}
          <Section style={heroBand}>
            <Text style={heroLabel}>ORDER CONFIRMED</Text>
            <Heading style={heroOrderId}>#{displayId}</Heading>
          </Section>

          {/* ── Greeting ── */}
          <Section style={contentSection}>
            <Text style={greeting}>Hi {customerName},</Text>
            <Text style={bodyText}>
              Thank you for your order! We&apos;ve received your payment and your
              kurta is already being prepared with care. You&apos;ll receive a
              shipping notification as soon as it&apos;s dispatched.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* ── Order Items ── */}
          <Section style={contentSection}>
            <Text style={sectionTitle}>ITEMS ORDERED</Text>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column style={itemDot}>
                  <Text style={dotText}>◆</Text>
                </Column>
                <Column style={itemDetails}>
                  <Text style={itemTitle}>{item.title}</Text>
                  <Text style={itemMeta}>
                    Size: {item.size} &nbsp;·&nbsp; Colour: {item.color}{' '}
                    &nbsp;·&nbsp; Qty: {item.quantity}
                  </Text>
                </Column>
                {item.price ? (
                  <Column style={itemPrice}>
                    <Text style={itemPriceText}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </Text>
                  </Column>
                ) : null}
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* ── Total ── */}
          <Section style={contentSection}>
            <Row>
              <Column>
                <Text style={totalLabel}>TOTAL PAID</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={totalAmount_}>{formattedTotal}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* ── Shipping Address ── */}
          <Section style={contentSection}>
            <Text style={sectionTitle}>SHIPPING TO</Text>
            <Text style={addressText}>
              {shippingAddress.name}
              {'\n'}
              {shippingAddress.addressLine1}
              {'\n'}
              {shippingAddress.city}, {shippingAddress.state} –{' '}
              {shippingAddress.pincode}
              {'\n'}
              📞 {shippingAddress.phone}
            </Text>
          </Section>

          <Hr style={divider} />

          {/* ── Payment Reference ── */}
          <Section style={contentSection}>
            <Text style={refLabel}>PAYMENT REFERENCE</Text>
            <Text style={refValue}>{paymentId}</Text>
          </Section>

          {/* ── Footer ── */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or visit{' '}
              <a href="https://viraasat.com/profile" style={footerLink}>
                your account
              </a>
              .
            </Text>
            <Text style={footerBrand}>
              © {new Date().getFullYear()} Viraasat — Handcrafted in India
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ── Styles ──────────────────────────────────────────────────────────────── */

const body: React.CSSProperties = {
  backgroundColor: '#FAF5F0',
  fontFamily:
    "'Georgia', 'Times New Roman', serif",
  margin: 0,
  padding: '32px 0',
};

const container: React.CSSProperties = {
  maxWidth: '580px',
  margin: '0 auto',
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  overflow: 'hidden',
  border: `1px solid ${BRAND_BEIGE}`,
};

const header: React.CSSProperties = {
  backgroundColor: BRAND_BROWN,
  padding: '36px 40px 28px',
  textAlign: 'center',
};

const brandName: React.CSSProperties = {
  color: BRAND_CREAM,
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '0.35em',
  margin: '0 0 4px',
};

const brandTagline: React.CSSProperties = {
  color: `${BRAND_CREAM}99`,
  fontSize: '11px',
  letterSpacing: '0.15em',
  margin: 0,
};

const heroBand: React.CSSProperties = {
  backgroundColor: BRAND_CREAM,
  padding: '24px 40px',
  textAlign: 'center',
  borderBottom: `2px solid ${BRAND_BEIGE}`,
};

const heroLabel: React.CSSProperties = {
  color: BRAND_MID,
  fontSize: '10px',
  letterSpacing: '0.3em',
  fontWeight: 700,
  margin: '0 0 6px',
};

const heroOrderId: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  margin: 0,
  fontFamily: 'monospace',
};

const contentSection: React.CSSProperties = {
  padding: '24px 40px',
};

const greeting: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '18px',
  fontWeight: 600,
  margin: '0 0 8px',
};

const bodyText: React.CSSProperties = {
  color: '#5C4B3B',
  fontSize: '14px',
  lineHeight: '1.7',
  margin: 0,
};

const divider: React.CSSProperties = {
  borderColor: BRAND_BEIGE,
  borderTopWidth: '1px',
  margin: 0,
};

const sectionTitle: React.CSSProperties = {
  color: BRAND_MID,
  fontSize: '10px',
  letterSpacing: '0.25em',
  fontWeight: 700,
  margin: '0 0 14px',
};

const itemRow: React.CSSProperties = {
  marginBottom: '10px',
};

const itemDot: React.CSSProperties = {
  width: '20px',
  verticalAlign: 'top',
  paddingTop: '2px',
};

const dotText: React.CSSProperties = {
  color: BRAND_BEIGE,
  fontSize: '10px',
  margin: 0,
};

const itemDetails: React.CSSProperties = {
  verticalAlign: 'top',
};

const itemTitle: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '14px',
  fontWeight: 600,
  margin: '0 0 2px',
};

const itemMeta: React.CSSProperties = {
  color: BRAND_MID,
  fontSize: '12px',
  margin: 0,
};

const itemPrice: React.CSSProperties = {
  textAlign: 'right',
  verticalAlign: 'top',
  width: '90px',
};

const itemPriceText: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '14px',
  fontWeight: 600,
  margin: 0,
};

const totalLabel: React.CSSProperties = {
  color: BRAND_MID,
  fontSize: '11px',
  letterSpacing: '0.2em',
  fontWeight: 700,
  margin: 0,
};

const totalAmount_: React.CSSProperties = {
  color: BRAND_BROWN,
  fontSize: '24px',
  fontWeight: 700,
  margin: 0,
  textAlign: 'right',
};

const addressText: React.CSSProperties = {
  color: '#5C4B3B',
  fontSize: '13px',
  lineHeight: '1.8',
  margin: 0,
  whiteSpace: 'pre-line',
};

const refLabel: React.CSSProperties = {
  color: BRAND_MID,
  fontSize: '10px',
  letterSpacing: '0.2em',
  fontWeight: 700,
  margin: '0 0 4px',
};

const refValue: React.CSSProperties = {
  color: '#7A6A5A',
  fontSize: '12px',
  fontFamily: 'monospace',
  margin: 0,
  wordBreak: 'break-all',
};

const footer: React.CSSProperties = {
  backgroundColor: BRAND_CREAM,
  padding: '20px 40px',
  textAlign: 'center',
  borderTop: `1px solid ${BRAND_BEIGE}`,
};

const footerText: React.CSSProperties = {
  color: '#8C6E5D',
  fontSize: '12px',
  margin: '0 0 6px',
};

const footerLink: React.CSSProperties = {
  color: BRAND_BROWN,
  fontWeight: 600,
};

const footerBrand: React.CSSProperties = {
  color: '#BCA99A',
  fontSize: '11px',
  letterSpacing: '0.1em',
  margin: 0,
};
