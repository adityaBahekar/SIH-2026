import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { listProducts } from '../services/api';
import type { WorkflowStep } from '../types';

interface HomeScreenProps {
  onCreateProduct: () => void;
  onViewProducts: () => void;
}

const steps: Array<{ label: string; step: WorkflowStep; detail: string }> = [
  { label: 'Photo', step: 'photo', detail: 'Improve and prepare the product image' },
  { label: 'Catalog', step: 'catalog', detail: 'Create a ready-to-share listing' },
  { label: 'Price', step: 'price', detail: 'Find a transparent selling price' },
  { label: 'Publish', step: 'publish', detail: 'Review and save your product' },
];

export function HomeScreen({ onCreateProduct, onViewProducts }: HomeScreenProps) {
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    listProducts()
      .then((items) => {
        if (mounted && Array.isArray(items)) {
          setProductCount(items.length);
        }
      })
      .catch(() => {
        // Silently ignore if server not reachable yet
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowDot} />
        <Text style={styles.eyebrow}>ARTISAN BUSINESS MANAGER</Text>
      </View>
      <Text style={styles.title}>Turn your craft into a story people can find.</Text>
      <Text style={styles.subtitle}>
        One photo, a few details, and a professional product listing ready to share.
      </Text>

      {productCount !== null && productCount > 0 ? (
        <TouchableOpacity accessibilityRole="button" style={styles.statsCard} onPress={onViewProducts}>
          <Text style={styles.statsCount}>{productCount}</Text>
          <View style={styles.statsCopy}>
            <Text style={styles.statsTitle}>{productCount === 1 ? 'Product saved' : 'Products saved'}</Text>
            <Text style={styles.statsDetail}>Ready in your artisan catalog</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      <View style={styles.workflow}>
        {steps.map((item, index) => (
          <View key={item.step} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepCopy}>
              <Text style={styles.stepLabel}>{item.label}</Text>
              <Text style={styles.stepDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity accessibilityRole="button" style={styles.primaryButton} onPress={onCreateProduct}>
        <Text style={styles.primaryButtonText}>Create a product</Text>
        <Text style={styles.primaryButtonArrow}>→</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Your details stay with your product draft until you save it.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F3EC',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
  },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
  eyebrowDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D96C45' },
  eyebrow: { color: '#7B766E', fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  title: { color: '#263B35', fontSize: 36, lineHeight: 42, fontWeight: '800' },
  subtitle: { color: '#6F736D', fontSize: 16, lineHeight: 24, marginTop: 14 },
  statsCard: { backgroundColor: '#E8F0E3', borderRadius: 16, padding: 16, marginTop: 22, flexDirection: 'row', alignItems: 'center', gap: 14 },
  statsCount: { color: '#263B35', fontSize: 32, fontWeight: '800', minWidth: 40, textAlign: 'center' },
  statsCopy: { flex: 1 },
  statsTitle: { color: '#263B35', fontSize: 15, fontWeight: '800' },
  statsDetail: { color: '#53725C', fontSize: 13, marginTop: 2 },
  workflow: { marginTop: 28, borderTopWidth: 1, borderTopColor: '#DDD7CD' },
  stepRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#DDD7CD' },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#DDE7D8', alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: '#355544', fontSize: 14, fontWeight: '800' },
  stepCopy: { marginLeft: 14 },
  stepLabel: { color: '#263B35', fontSize: 16, fontWeight: '800' },
  stepDetail: { color: '#7B766E', fontSize: 13, marginTop: 3 },
  primaryButton: { backgroundColor: '#D96C45', minHeight: 58, borderRadius: 16, marginTop: 28, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButtonText: { color: '#FFF9F2', fontSize: 17, fontWeight: '800' },
  primaryButtonArrow: { color: '#FFF9F2', fontSize: 26, fontWeight: '300' },
  note: { color: '#8D887F', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 14 },
});
