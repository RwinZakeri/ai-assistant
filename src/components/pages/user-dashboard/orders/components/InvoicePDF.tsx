'use client';

import type { GetOrderInvoiceDataOutput } from '@/apis/models/GetOrderInvoiceDataOutput';
import { formatDate } from '@/utils/formatDate';
import numberSeprator from '@/utils/numberSeprator';
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import React from 'react';

Font.register({
  family: 'Pelak',
  fonts: [
    {
      src: '/fonts/pelak/PelakFA.woff',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/pelak/PelakFA-ExtraBold.woff',
      fontWeight: 'bold',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Pelak',
    direction: 'rtl',
  },
  header: {
    marginBottom: 15,
    borderBottom: '2 solid #000000',
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  invoiceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoColumn: {
    width: '48%',
  },
  infoLabel: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 3,
    textAlign: 'right',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottom: '1 solid #CCCCCC',
    paddingBottom: 4,
    textAlign: 'right',
  },
  customerInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  customerField: {
    width: '50%',
    marginBottom: 8,
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderBottom: '1 solid #CCCCCC',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1 solid #EEEEEE',
  },
  tableCell: {
    fontSize: 10,
    padding: 4,
  },
  colProduct: {
    width: '30%',
    textAlign: 'right',
  },
  colQuantity: {
    width: '15%',
    textAlign: 'center',
  },
  colUnitPrice: {
    width: '20%',
    textAlign: 'right',
  },
  colDiscount: {
    width: '15%',
    textAlign: 'right',
  },
  colTotal: {
    width: '20%',
    textAlign: 'right',
  },
  totals: {
    marginTop: 15,
    alignSelf: 'flex-end',
    width: '40%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 11,
    color: '#666666',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  finalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '2 solid #000000',
  },
  finalTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  finalTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    paddingTop: 12,
    borderTop: '1 solid #CCCCCC',
    textAlign: 'center',
    fontSize: 9,
    color: '#666666',
  },
});

interface InvoicePDFProps {
  invoiceData: GetOrderInvoiceDataOutput;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoiceData }) => {
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) {
      return '0';
    }
    return `${numberSeprator(String(amount))} تومان`;
  };

  const formatPersianDate = (date: string | undefined) => {
    if (!date) {
      return 'ثبت نشده';
    }
    return formatDate(date);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>فاکتور فروش</Text>
          <View style={styles.invoiceInfo}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>شماره سفارش:</Text>
              <Text style={styles.infoValue}>
                {invoiceData.orderNo || 'ثبت نشده'}
              </Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>تاریخ ارسال:</Text>
              <Text style={styles.infoValue}>
                {formatPersianDate(invoiceData.sendingDate)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اطلاعات مشتری</Text>
          <View style={styles.customerInfo}>
            <View style={styles.customerField}>
              <Text style={styles.infoLabel}>نام مشتری:</Text>
              <Text style={styles.infoValue}>
                {invoiceData.customerName || 'ثبت نشده'}
              </Text>
            </View>
            <View style={styles.customerField}>
              <Text style={styles.infoLabel}>کد ملی:</Text>
              <Text style={styles.infoValue}>
                {invoiceData.nationalCode || 'ثبت نشده'}
              </Text>
            </View>
            <View style={styles.customerField}>
              <Text style={styles.infoLabel}>شماره تماس:</Text>
              <Text style={styles.infoValue}>
                {invoiceData.phoneNumber || 'ثبت نشده'}
              </Text>
            </View>
            <View style={styles.customerField}>
              <Text style={styles.infoLabel}>کد پستی:</Text>
              <Text style={styles.infoValue}>
                {invoiceData.postalCode || 'ثبت نشده'}
              </Text>
            </View>
          </View>
          <View style={styles.customerField}>
            <Text style={styles.infoLabel}>آدرس:</Text>
            <Text style={styles.infoValue}>
              {invoiceData.address || 'ثبت نشده'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>اقلام سفارش</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, styles.colTotal]}>جمع</Text>
              <Text style={[styles.tableCell, styles.colDiscount]}>تخفیف</Text>
              <Text style={[styles.tableCell, styles.colUnitPrice]}>
                قیمت واحد
              </Text>
              <Text style={[styles.tableCell, styles.colQuantity]}>تعداد</Text>
              <Text style={[styles.tableCell, styles.colProduct]}>محصول</Text>
            </View>
            {invoiceData.orderItems?.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.colTotal]}>
                  {formatCurrency(item.discountedPrice || item.lineSubtotal)}
                </Text>
                <Text style={[styles.tableCell, styles.colDiscount]}>
                  {formatCurrency(item.discountAmount)}
                </Text>
                <Text style={[styles.tableCell, styles.colUnitPrice]}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={[styles.tableCell, styles.colQuantity]}>
                  {item.quantity || 0}
                </Text>
                <Text style={[styles.tableCell, styles.colProduct]}>
                  {item.productName || 'ثبت نشده'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalValue}>
              {formatCurrency(invoiceData.subtotalBeforeDiscount)}
            </Text>
            <Text style={styles.totalLabel}>:جمع کل قبل از تخفیف</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalValue}>
              {formatCurrency(invoiceData.discountAmount)}
            </Text>
            <Text style={styles.totalLabel}>:مبلغ تخفیف</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalValue}>
              {formatCurrency(invoiceData.subtotalAfterDiscount)}
            </Text>
            <Text style={styles.totalLabel}>:جمع کل بعد از تخفیف</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalValue}>
              {formatCurrency(invoiceData.shippingAmount)}
            </Text>
            <Text style={styles.totalLabel}>:هزینه ارسال</Text>
          </View>
          <View style={styles.finalTotal}>
            <Text style={styles.finalTotalValue}>
              {formatCurrency(
                invoiceData.totalPayable || invoiceData.totalPrice,
              )}
            </Text>
            <Text style={styles.finalTotalLabel}>:مبلغ قابل پرداخت</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>با تشکر از خرید شما</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
