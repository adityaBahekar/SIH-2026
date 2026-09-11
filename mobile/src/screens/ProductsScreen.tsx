import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { deleteProduct, listProducts, updateProduct, type Product } from '../services/api';

interface ProductsScreenProps {
  onBack: () => void;
  onCreateNew?: () => void;
}

export function ProductsScreen({ onBack, onCreateNew }: ProductsScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [activeModalLang, setActiveModalLang] = useState<'en' | 'hi'>('en');
  const [showOriginalImage, setShowOriginalImage] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listProducts();
      setProducts(items);
    } catch {
      setError('We could not load your catalog right now. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'published' ? 'draft' : 'published';
    setUpdatingStatus(true);
    try {
      const updated = await updateProduct(product.id, { status: nextStatus });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelectedProduct(updated);
    } catch (err) {
      Alert.alert('Status Update Failed', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = (productId: string, productTitle: string) => {
    Alert.alert(
      'Delete Listing?',
      `Are you sure you want to remove "${productTitle}" from your catalog? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(productId);
              setProducts((prev) => prev.filter((p) => p.id !== productId));
              setSelectedProduct(null);
              Alert.alert('Product Deleted', 'The listing has been removed.');
            } catch (err) {
              Alert.alert('Delete failed', err instanceof Error ? err.message : 'Please try again.');
            }
          },
        },
      ]
    );
  };

  const copyListingShare = (product: Product) => {
    const shareText = `*${product.title}*\n` +
      `Category: ${product.category}\n` +
      (product.material ? `Material: ${product.material}\n` : '') +
      (product.origin ? `Heritage: ${product.origin}\n` : '') +
      `Price: ₹${product.recommendedPrice}\n\n` +
      `${product.descriptionEn}\n\n` +
      `_Handcrafted by authentic Indian artisans._`;

    Alert.alert(
      'Share Product Listing',
      shareText,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Copy Summary',
          onPress: () => {
            Alert.alert('Copied!', 'Listing summary ready to paste on WhatsApp or social media.');
          },
        },
      ]
    );
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back to Home</Text>
          </TouchableOpacity>
          {onCreateNew ? (
            <TouchableOpacity onPress={onCreateNew} style={styles.addNavBtn}>
              <Text style={styles.addNavText}>+ New Product</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>PRAGATI · ARTISAN INVENTORY</Text>
            <Text style={styles.title}>Your Catalog</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{products.length} {products.length === 1 ? 'Item' : 'Items'}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>Tap any product card to view full specifications, pricing math, and share options.</Text>

        {/* SEARCH & FILTERS */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by craft, material, title..."
            placeholderTextColor="#9A968D"
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.filterRow}>
          {(['all', 'published', 'draft'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setStatusFilter(filter)}
              style={[styles.filterChip, statusFilter === filter ? styles.filterChipActive : null]}
            >
              <Text style={[styles.filterText, statusFilter === filter ? styles.filterTextActive : null]}>
                {filter === 'all' ? 'All' : filter === 'published' ? '🟢 Published' : '🟡 Drafts'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? <ActivityIndicator color="#C85A32" size="large" style={styles.loader} /> : null}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchProducts} style={styles.retryBtn}>
              <Text style={styles.retryBtnText}>Retry Connection</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {!loading && !error && filteredProducts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏺</Text>
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first listing and it will appear here.'}
            </Text>
          </View>
        ) : null}

        {/* PRODUCT CARDS */}
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => {
              setSelectedProduct(product);
              setShowOriginalImage(false);
              setActiveModalLang('en');
            }}
          >
            {product.imageEnhancedUrl ? (
              <Image source={{ uri: product.imageEnhancedUrl }} style={styles.image} />
            ) : (
              <View style={styles.imageFallback}>
                <Text style={styles.imageFallbackText}>Craft</Text>
              </View>
            )}

            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <View style={[styles.statusBadge, product.status === 'published' ? styles.statusPublished : styles.statusDraft]}>
                  <Text style={[styles.statusBadgeText, product.status === 'published' ? styles.statusPublishedText : styles.statusDraftText]}>
                    {product.status === 'published' ? 'Published' : 'Draft'}
                  </Text>
                </View>
                <Text style={styles.stockBadge}>Stock: {product.stock ?? 5}</Text>
              </View>

              <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
              <Text style={styles.meta}>
                {product.category} {product.material ? `· ${product.material}` : ''}
              </Text>

              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.priceLabel}>Selling Price</Text>
                  <Text style={styles.price}>₹{product.recommendedPrice}</Text>
                </View>
                <View style={styles.viewDetailBtn}>
                  <Text style={styles.viewDetailText}>Details →</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* DETAIL MODAL */}
      {selectedProduct ? (
        <Modal
          visible={Boolean(selectedProduct)}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setSelectedProduct(null)}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              {/* MODAL HEADER */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setSelectedProduct(null)} style={styles.modalCloseBtn}>
                  <Text style={styles.modalCloseText}>✕ Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleStatus(selectedProduct)}
                  disabled={updatingStatus}
                  style={[styles.statusToggleBtn, selectedProduct.status === 'published' ? styles.statusTogglePublished : styles.statusToggleDraft]}
                >
                  {updatingStatus ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.statusToggleText}>
                      {selectedProduct.status === 'published' ? '🟢 Published (Tap to Draft)' : '🟡 Draft (Tap to Publish)'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* IMAGE BANNER */}
              <View style={styles.modalImageCard}>
                <Image
                  source={{ uri: showOriginalImage ? selectedProduct.imageOriginalUrl : selectedProduct.imageEnhancedUrl }}
                  style={styles.modalImage}
                />
                <View style={styles.imageToggleBar}>
                  <Text style={styles.imageModeLabel}>
                    {showOriginalImage ? 'Original Artisan Photo' : '✨ Cloudinary Studio Enhanced'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowOriginalImage((prev) => !prev)}
                    style={styles.imageToggleBtn}
                  >
                    <Text style={styles.imageToggleBtnText}>
                      {showOriginalImage ? 'Show Enhanced' : 'Show Original'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* TITLE & CATEGORY */}
              <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{selectedProduct.category}</Text>
                </View>
                {selectedProduct.origin ? (
                  <View style={styles.originBadge}>
                    <Text style={styles.originBadgeText}>📍 {selectedProduct.origin}</Text>
                  </View>
                ) : null}
                <View style={styles.stockPill}>
                  <Text style={styles.stockPillText}>Inventory: {selectedProduct.stock ?? 5} units</Text>
                </View>
              </View>

              {/* PRICE CARD */}
              <View style={styles.modalPriceCard}>
                <View style={styles.modalPriceHeader}>
                  <Text style={styles.modalPriceLabel}>RECOMMENDED SELLING PRICE</Text>
                  <Text style={styles.marginText}>Margin: {selectedProduct.marginPercentage}%</Text>
                </View>
                <Text style={styles.modalPrice}>₹{selectedProduct.recommendedPrice}</Text>
                <Text style={styles.modalRange}>Suggested negotiation: ₹{selectedProduct.minPrice} – ₹{selectedProduct.maxPrice}</Text>

                <View style={styles.costDetailsGrid}>
                  <View style={styles.costCol}>
                    <Text style={styles.costColLabel}>Material</Text>
                    <Text style={styles.costColValue}>₹{selectedProduct.materialCost}</Text>
                  </View>
                  <View style={styles.costCol}>
                    <Text style={styles.costColLabel}>Labour</Text>
                    <Text style={styles.costColValue}>₹{selectedProduct.labourCost}</Text>
                  </View>
                  <View style={styles.costCol}>
                    <Text style={styles.costColLabel}>Packaging</Text>
                    <Text style={styles.costColValue}>₹{selectedProduct.packagingCost}</Text>
                  </View>
                  <View style={styles.costCol}>
                    <Text style={styles.costColLabel}>Total Cost</Text>
                    <Text style={styles.costColValue}>₹{selectedProduct.totalCost}</Text>
                  </View>
                </View>

                {selectedProduct.pricingExplanation && selectedProduct.pricingExplanation.length > 0 ? (
                  <View style={styles.explanationBox}>
                    {selectedProduct.pricingExplanation.map((line, i) => (
                      <Text key={i} style={styles.expLine}>• {line}</Text>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* CRAFT SPECIFICATIONS */}
              <View style={styles.specsCard}>
                <Text style={styles.specsTitle}>Full Craft Specifications</Text>
                <View style={styles.specGrid}>
                  <View style={styles.specBox}>
                    <Text style={styles.specBoxLabel}>Craft Technique</Text>
                    <Text style={styles.specBoxValue}>{selectedProduct.technique || 'Handmade traditional'}</Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specBoxLabel}>Material</Text>
                    <Text style={styles.specBoxValue}>{selectedProduct.material || 'Natural Handcrafted'}</Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specBoxLabel}>Color Palette</Text>
                    <Text style={styles.specBoxValue}>{selectedProduct.color || 'Natural tone'}</Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specBoxLabel}>Dimensions</Text>
                    <Text style={styles.specBoxValue}>{selectedProduct.dimensions || 'Standard'}</Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specBoxLabel}>Weight</Text>
                    <Text style={styles.specBoxValue}>{selectedProduct.weight || 'Standard'}</Text>
                  </View>
                  <View style={styles.specBox}>
                    <Text style={styles.specBoxLabel}>Units in Stock</Text>
                    <Text style={styles.specBoxValue}>{selectedProduct.stock ?? 5} units</Text>
                  </View>
                </View>

                {selectedProduct.careInstructions ? (
                  <View style={styles.careRow}>
                    <Text style={styles.careTitle}>🧼 Care Instructions:</Text>
                    <Text style={styles.careContent}>{selectedProduct.careInstructions}</Text>
                  </View>
                ) : null}
              </View>

              {/* BILINGUAL STORY */}
              <View style={styles.storyCard}>
                <View style={styles.storyHeader}>
                  <Text style={styles.specsTitle}>Artisan Story</Text>
                  <View style={styles.langToggle}>
                    <TouchableOpacity
                      onPress={() => setActiveModalLang('en')}
                      style={[styles.langBtn, activeModalLang === 'en' ? styles.langBtnActive : null]}
                    >
                      <Text style={[styles.langBtnText, activeModalLang === 'en' ? styles.langBtnTextActive : null]}>English</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setActiveModalLang('hi')}
                      style={[styles.langBtn, activeModalLang === 'hi' ? styles.langBtnActive : null]}
                    >
                      <Text style={[styles.langBtnText, activeModalLang === 'hi' ? styles.langBtnTextActive : null]}>हिंदी</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.storyText}>
                  {activeModalLang === 'en' ? selectedProduct.descriptionEn : selectedProduct.descriptionHi}
                </Text>

                {selectedProduct.keywords && selectedProduct.keywords.length > 0 ? (
                  <View style={styles.kwWrap}>
                    {selectedProduct.keywords.map((kw, i) => (
                      <View key={i} style={styles.kwPill}>
                        <Text style={styles.kwPillText}>#{kw}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>

              {/* ACTION TOOLBAR */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={() => copyListingShare(selectedProduct)}
                >
                  <Text style={styles.shareBtnText}>📤 Share / Copy Listing</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(selectedProduct.id, selectedProduct.title)}
                >
                  <Text style={styles.deleteBtnText}>🗑️ Delete</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF7F2' },
  content: { paddingHorizontal: 22, paddingTop: 38, paddingBottom: 50 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  backButton: { paddingVertical: 6 },
  backText: { color: '#445D48', fontSize: 14, fontWeight: '700' },
  addNavBtn: { backgroundColor: '#C85A32', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  addNavText: { color: '#FFF9F2', fontSize: 12, fontWeight: '800' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 8 },
  kicker: { color: '#C85A32', fontSize: 12, fontWeight: '800', letterSpacing: 1.1 },
  title: { color: '#1E3A2F', fontSize: 30, lineHeight: 36, fontWeight: '800', marginTop: 4 },
  countBadge: { backgroundColor: '#EDE3D2', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  countText: { color: '#594A38', fontSize: 12, fontWeight: '800' },
  subtitle: { color: '#6F736D', fontSize: 14, lineHeight: 21, marginTop: 6 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFDF9', borderRadius: 12, borderWidth: 1, borderColor: '#D8D0C3', paddingHorizontal: 12, minHeight: 44, marginTop: 16 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: '#1E3A2F', fontSize: 14 },
  clearSearch: { color: '#888277', fontSize: 16, paddingHorizontal: 4 },
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 6 },
  filterChip: { backgroundColor: '#F0E9DF', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#DDD4C7' },
  filterChipActive: { backgroundColor: '#1E3A2F', borderColor: '#1E3A2F' },
  filterText: { color: '#4A463F', fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: '#FAF7F2' },
  loader: { marginTop: 36 },
  errorBox: { backgroundColor: '#FBEBE8', borderRadius: 14, padding: 16, marginTop: 20, alignItems: 'center' },
  errorText: { color: '#A03B24', fontSize: 13, textAlign: 'center' },
  retryBtn: { marginTop: 10, backgroundColor: '#A03B24', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  retryBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  empty: { backgroundColor: '#F3EFE7', borderRadius: 18, padding: 28, marginTop: 24, alignItems: 'center' },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyTitle: { color: '#1E3A2F', fontSize: 18, fontWeight: '800' },
  emptyText: { color: '#6F736D', fontSize: 14, textAlign: 'center', marginTop: 4 },
  card: { flexDirection: 'row', backgroundColor: '#FFFDF9', borderRadius: 18, overflow: 'hidden', marginTop: 14, borderWidth: 1, borderColor: '#E5DED4', elevation: 1 },
  image: { width: 120, height: 130, backgroundColor: '#E4DED4' },
  imageFallback: { width: 120, height: 130, backgroundColor: '#E2EBDD', alignItems: 'center', justifyContent: 'center' },
  imageFallbackText: { color: '#3A5C41', fontWeight: '800' },
  cardBody: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  statusPublished: { backgroundColor: '#D6ECD2' },
  statusDraft: { backgroundColor: '#F7E7CD' },
  statusBadgeText: { fontSize: 10, fontWeight: '800' },
  statusPublishedText: { color: '#1E5828' },
  statusDraftText: { color: '#7E5B10' },
  stockBadge: { color: '#7E7A71', fontSize: 11, fontWeight: '700' },
  productTitle: { color: '#1E3A2F', fontSize: 15, fontWeight: '800', lineHeight: 20, marginTop: 4 },
  meta: { color: '#7E7A71', fontSize: 12, marginTop: 2 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  priceLabel: { color: '#888277', fontSize: 10, fontWeight: '700' },
  price: { color: '#C85A32', fontSize: 18, fontWeight: '900' },
  viewDetailBtn: { backgroundColor: '#F0E9DF', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  viewDetailText: { color: '#1E3A2F', fontSize: 12, fontWeight: '800' },
  // MODAL STYLES
  modalContainer: { flex: 1, backgroundColor: '#FAF7F2' },
  modalContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 50 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalCloseBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#EDE5D8', borderRadius: 8 },
  modalCloseText: { color: '#1E3A2F', fontSize: 13, fontWeight: '800' },
  statusToggleBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  statusTogglePublished: { backgroundColor: '#2C5E3B' },
  statusToggleDraft: { backgroundColor: '#B87820' },
  statusToggleText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  modalImageCard: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#DDD4C7', backgroundColor: '#FFF' },
  modalImage: { width: '100%', height: 260, resizeMode: 'cover', backgroundColor: '#E4DED4' },
  imageToggleBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#FAF7F2', borderTopWidth: 1, borderTopColor: '#EEE7DD' },
  imageModeLabel: { color: '#3A5C41', fontSize: 12, fontWeight: '800' },
  imageToggleBtn: { backgroundColor: '#E8DFD1', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  imageToggleBtnText: { color: '#1E3A2F', fontSize: 11, fontWeight: '700' },
  modalTitle: { color: '#1E3A2F', fontSize: 24, fontWeight: '900', lineHeight: 30, marginTop: 16 },
  badgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 8 },
  catBadge: { backgroundColor: '#EDE3D2', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  catBadgeText: { color: '#594A38', fontSize: 12, fontWeight: '800' },
  originBadge: { backgroundColor: '#E2EBDD', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  originBadgeText: { color: '#2F5938', fontSize: 12, fontWeight: '700' },
  stockPill: { backgroundColor: '#F0E9DF', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  stockPillText: { color: '#4A463F', fontSize: 12, fontWeight: '700' },
  modalPriceCard: { backgroundColor: '#EBF2E8', borderRadius: 18, borderWidth: 1, borderColor: '#C8D9C2', padding: 18, marginTop: 16 },
  modalPriceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalPriceLabel: { color: '#3A5C41', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  marginText: { color: '#3A5C41', fontSize: 12, fontWeight: '800' },
  modalPrice: { color: '#1E3A2F', fontSize: 36, fontWeight: '900', marginTop: 4 },
  modalRange: { color: '#2C4E33', fontSize: 13, fontWeight: '700', marginTop: 2 },
  costDetailsGrid: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 10, marginTop: 12 },
  costCol: { flex: 1, alignItems: 'center' },
  costColLabel: { color: '#7E7A71', fontSize: 11, fontWeight: '700' },
  costColValue: { color: '#1E3A2F', fontSize: 13, fontWeight: '800', marginTop: 2 },
  explanationBox: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#D3E2CD' },
  expLine: { color: '#445D48', fontSize: 11, lineHeight: 16, marginTop: 2 },
  specsCard: { backgroundColor: '#FFFDF9', borderRadius: 16, borderWidth: 1, borderColor: '#E5DED4', padding: 16, marginTop: 16 },
  specsTitle: { color: '#1E3A2F', fontSize: 15, fontWeight: '800', marginBottom: 10 },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specBox: { width: '48%', backgroundColor: '#FAF7F2', borderRadius: 8, padding: 10 },
  specBoxLabel: { color: '#7E7A71', fontSize: 11, fontWeight: '700' },
  specBoxValue: { color: '#1E3A2F', fontSize: 13, fontWeight: '800', marginTop: 2 },
  careRow: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0EAE1' },
  careTitle: { color: '#594A38', fontSize: 12, fontWeight: '800' },
  careContent: { color: '#4A463F', fontSize: 12, lineHeight: 17, marginTop: 2 },
  storyCard: { backgroundColor: '#FFFDF9', borderRadius: 16, borderWidth: 1, borderColor: '#E5DED4', padding: 16, marginTop: 16 },
  storyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  langToggle: { flexDirection: 'row', backgroundColor: '#F0E9DF', borderRadius: 8, padding: 2 },
  langBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  langBtnActive: { backgroundColor: '#1E3A2F' },
  langBtnText: { color: '#594A38', fontSize: 12, fontWeight: '700' },
  langBtnTextActive: { color: '#FAF7F2' },
  storyText: { color: '#3A3731', fontSize: 14, lineHeight: 22 },
  kwWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  kwPill: { backgroundColor: '#EDE5D8', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  kwPillText: { color: '#594A38', fontSize: 11, fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  shareBtn: { flex: 2, backgroundColor: '#1E3A2F', minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  shareBtnText: { color: '#FFF9F2', fontSize: 14, fontWeight: '800' },
  deleteBtn: { flex: 1, backgroundColor: '#FBEBE8', borderWidth: 1, borderColor: '#ECCDC5', minHeight: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { color: '#A03B24', fontSize: 14, fontWeight: '800' },
});
