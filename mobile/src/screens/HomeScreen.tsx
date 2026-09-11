import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { listProducts } from '../services/api';
import type { WorkflowStep } from '../types';

interface HomeScreenProps {
  onCreateProduct: () => void;
  onViewProducts: () => void;
}

const steps: Array<{ label: string; step: WorkflowStep; detail: string; icon: string }> = [
  { label: 'Photo & Story', step: 'photo', detail: 'Upload and enhance your product image', icon: '📷' },
  { label: 'AI Smart Catalog', step: 'catalog', detail: 'Generate bilingual listing with Gemini AI', icon: '🏺' },
  { label: 'Fair Pricing', step: 'price', detail: 'Transparent cost-plus pricing math', icon: '💰' },
  { label: 'Review & Save', step: 'publish', detail: 'Verify, share, and publish listing', icon: '✅' },
];

export function HomeScreen({ onCreateProduct, onViewProducts }: HomeScreenProps) {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [publishedCount, setPublishedCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    listProducts()
      .then((items) => {
        if (mounted && Array.isArray(items)) {
          setProductCount(items.length);
          setPublishedCount(items.filter((p) => p.status === 'published').length);
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
      <View style={styles.brandRow}>
        <View style={styles.brandDot} />
        <Text style={styles.brandName}>PRAGATI</Text>
        <View style={styles.brandPill}>
          <Text style={styles.brandPillText}>प्रगति · Artisan AI</Text>
        </View>
      </View>

      <Text style={styles.title}>Turn your craft{'\n'}into a story{'\n'}people can find.</Text>
      <Text style={styles.subtitle}>
        One photo, a few details, and a professional bilingual product listing with transparent fair pricing — ready to share anywhere.
      </Text>

      {/* QUICK STATS */}
      {productCount !== null && productCount > 0 ? (
        <TouchableOpacity accessibilityRole="button" style={styles.statsCard} onPress={onViewProducts}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{productCount}</Text>
              <Text style={styles.statLabel}>{productCount === 1 ? 'Product' : 'Products'}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{publishedCount}</Text>
              <Text style={styles.statLabel}>Published</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{productCount - publishedCount}</Text>
              <Text style={styles.statLabel}>Drafts</Text>
            </View>
          </View>
          <View style={styles.viewCatalogRow}>
            <Text style={styles.viewCatalogText}>View your artisan catalog →</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {/* WORKFLOW STEPS */}
      <Text style={styles.howItWorks}>HOW IT WORKS</Text>
      <View style={styles.workflow}>
        {steps.map((item, index) => (
          <View key={item.step} style={styles.stepRow}>
            <View style={styles.stepLeft}>
              <View style={styles.stepIconCircle}>
                <Text style={styles.stepIcon}>{item.icon}</Text>
              </View>
              {index < steps.length - 1 ? <View style={styles.stepConnector} /> : null}
            </View>
            <View style={styles.stepCopy}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>Step {index + 1}</Text>
              </View>
              <Text style={styles.stepLabel}>{item.label}</Text>
              <Text style={styles.stepDetail}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity accessibilityRole="button" style={styles.primaryButton} onPress={onCreateProduct}>
        <Text style={styles.primaryButtonText}>Create a new product</Text>
        <Text style={styles.primaryButtonArrow}>→</Text>
      </TouchableOpacity>

      {productCount !== null && productCount > 0 ? (
        <TouchableOpacity accessibilityRole="button" style={styles.secondaryButton} onPress={onViewProducts}>
          <Text style={styles.secondaryButtonText}>Browse saved catalog ({productCount})</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.note}>Your details stay as a draft until you choose to save. Works offline in demo mode.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF7F2' },
  content: { paddingHorizontal: 22, paddingTop: 50, paddingBottom: 50 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#C85A32' },
  brandName: { color: '#1E3A2F', fontSize: 18, fontWeight: '900', letterSpacing: 1.8 },
  brandPill: { backgroundColor: '#EDE5D8', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  brandPillText: { color: '#7E7A71', fontSize: 11, fontWeight: '800' },
  title: { color: '#1E3A2F', fontSize: 34, lineHeight: 42, fontWeight: '900' },
  subtitle: { color: '#6F736D', fontSize: 15, lineHeight: 23, marginTop: 14 },
  statsCard: { backgroundColor: '#FFFDF9', borderRadius: 18, borderWidth: 1, borderColor: '#E5DED4', overflow: 'hidden', marginTop: 22 },
  statsRow: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#1E3A2F', fontSize: 26, fontWeight: '900' },
  statLabel: { color: '#7E7A71', fontSize: 12, fontWeight: '700', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: '#E5DED4' },
  viewCatalogRow: { backgroundColor: '#EBF2E8', paddingVertical: 10, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#D8E5D2' },
  viewCatalogText: { color: '#2C5E3B', fontSize: 13, fontWeight: '800' },
  howItWorks: { color: '#C85A32', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginTop: 28, marginBottom: 14 },
  workflow: { marginBottom: 8 },
  stepRow: { flexDirection: 'row', marginBottom: 4 },
  stepLeft: { alignItems: 'center', width: 44, marginRight: 14 },
  stepIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EDE5D8', alignItems: 'center', justifyContent: 'center' },
  stepIcon: { fontSize: 18 },
  stepConnector: { width: 2, flex: 1, backgroundColor: '#DDD4C7', minHeight: 20 },
  stepCopy: { flex: 1, paddingBottom: 18 },
  stepNumberBadge: { alignSelf: 'flex-start', backgroundColor: '#F0E9DF', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, marginBottom: 4 },
  stepNumberText: { color: '#7E7A71', fontSize: 10, fontWeight: '800' },
  stepLabel: { color: '#1E3A2F', fontSize: 16, fontWeight: '800' },
  stepDetail: { color: '#7E7A71', fontSize: 13, marginTop: 3 },
  primaryButton: { backgroundColor: '#C85A32', minHeight: 58, borderRadius: 16, marginTop: 20, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButtonText: { color: '#FFF9F2', fontSize: 17, fontWeight: '800' },
  primaryButtonArrow: { color: '#FFF9F2', fontSize: 26, fontWeight: '300' },
  secondaryButton: { borderWidth: 1.5, borderColor: '#1E3A2F', minHeight: 50, borderRadius: 14, marginTop: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { color: '#1E3A2F', fontSize: 15, fontWeight: '800' },
  note: { color: '#9E988D', fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: 16 },
});
