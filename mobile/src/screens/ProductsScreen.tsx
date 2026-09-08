import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { listProducts, type ProductSummary } from '../services/api';

interface ProductsScreenProps {
  onBack: () => void;
}

export function ProductsScreen({ onBack }: ProductsScreenProps) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    listProducts()
      .then((items) => {
        if (mounted) setProducts(items);
      })
      .catch(() => {
        if (mounted) setError('We could not load your catalog right now.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Home</Text>
      </TouchableOpacity>
      <Text style={styles.kicker}>YOUR CATALOG</Text>
      <Text style={styles.title}>Saved products</Text>
      <Text style={styles.subtitle}>Your reviewed product listings in one place.</Text>
      {loading ? <ActivityIndicator color="#D96C45" size="large" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error && products.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyTitle}>No products yet</Text><Text style={styles.emptyText}>Create your first listing and it will appear here.</Text></View>
      ) : null}
      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          {product.imageEnhancedUrl ? <Image source={{ uri: product.imageEnhancedUrl }} style={styles.image} /> : <View style={styles.imageFallback}><Text style={styles.imageFallbackText}>Craft</Text></View>}
          <View style={styles.cardBody}>
            <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
            <Text style={styles.meta}>{product.category} {product.material ? `· ${product.material}` : ''}</Text>
            <Text style={styles.price}>₹{product.recommendedPrice}</Text>
            <Text style={styles.status}>{product.status === 'published' ? 'Published' : 'Draft'}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F3EC' },
  content: { paddingHorizontal: 24, paddingTop: 42, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8 },
  backText: { color: '#53665A', fontSize: 15, fontWeight: '700' },
  kicker: { color: '#D96C45', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginTop: 20 },
  title: { color: '#263B35', fontSize: 32, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#6F736D', fontSize: 15, lineHeight: 22, marginTop: 8 },
  loader: { marginTop: 42 },
  error: { color: '#A74D36', fontSize: 14, marginTop: 28 },
  empty: { backgroundColor: '#E8F0E3', borderRadius: 16, padding: 20, marginTop: 28 },
  emptyTitle: { color: '#263B35', fontSize: 17, fontWeight: '800' },
  emptyText: { color: '#53725C', fontSize: 14, lineHeight: 20, marginTop: 5 },
  card: { flexDirection: 'row', backgroundColor: '#FFFDF9', borderRadius: 16, overflow: 'hidden', marginTop: 18, borderWidth: 1, borderColor: '#E2DCD3' },
  image: { width: 112, height: 112, backgroundColor: '#E4DED4' },
  imageFallback: { width: 112, height: 112, backgroundColor: '#DDE7D8', alignItems: 'center', justifyContent: 'center' },
  imageFallbackText: { color: '#53725C', fontWeight: '800' },
  cardBody: { flex: 1, padding: 14 },
  productTitle: { color: '#263B35', fontSize: 16, lineHeight: 21, fontWeight: '800' },
  meta: { color: '#6F736D', fontSize: 12, marginTop: 5 },
  price: { color: '#B65332', fontSize: 18, fontWeight: '800', marginTop: 11 },
  status: { color: '#53725C', fontSize: 11, fontWeight: '700', marginTop: 3 },
});
