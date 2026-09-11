import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { DraftProduct } from '../types';

interface CreateProductScreenProps {
  onBack: () => void;
  onContinue: (draft: DraftProduct) => void;
  loading?: boolean;
}

const CRAFT_SUGGESTIONS = [
  { label: '🏺 Terracotta Clay Vase', text: 'Handcrafted terracotta clay flower vase made using traditional potter wheel with natural kiln firing.' },
  { label: '🧣 Handloom Silk Saree', text: 'Authentic pure handloom silk saree with intricate zari woven borders and traditional motifs.' },
  { label: '🪵 Sheesham Wood Box', text: 'Hand-carved Sheesham wood jewelry keepsake box with brass inlay detailing and natural wax finish.' },
  { label: '💍 Filigree Silver Earrings', text: 'Traditional handmade silver filigree jhumka earrings crafted by local artisans.' },
  { label: '👜 Eco Jute Tote Bag', text: 'Eco-friendly handwoven natural jute tote bag with vegan cotton rope handles.' },
  { label: '🎨 Madhubani Painting', text: 'Handmade traditional Madhubani folk painting on handmade paper using natural organic dyes.' },
];

export function CreateProductScreen({ onBack, onContinue, loading = false }: CreateProductScreenProps) {
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const chooseImage = async (useCamera: boolean): Promise<void> => {
    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.85 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const applySuggestion = (text: string) => {
    setDescription(text);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity accessibilityRole="button" onPress={onBack} style={styles.backButton} disabled={loading}>
          <Text style={styles.backText}>← Back to Home</Text>
        </TouchableOpacity>

        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>STEP 1 OF 4 · PHOTO & CRAFT</Text>
        </View>

        <Text style={styles.title}>Showcase your handcrafted art</Text>
        <Text style={styles.subtitle}>Take a photo of your product. Our AI will enhance the background and create a professional listing.</Text>

        <View style={styles.photoContainer}>
          {imageUri ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <View style={styles.imageOverlay}>
                <TouchableOpacity style={styles.changeBtn} onPress={() => chooseImage(false)} disabled={loading}>
                  <Text style={styles.changeBtnText}>🖼️ Choose Another</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.changeBtn} onPress={() => chooseImage(true)} disabled={loading}>
                  <Text style={styles.changeBtnText}>📷 Retake</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.uploadOptions}>
              <TouchableOpacity accessibilityRole="button" style={styles.uploadCard} onPress={() => chooseImage(false)} disabled={loading}>
                <View style={styles.iconCircle}>
                  <Text style={styles.uploadIcon}>🖼️</Text>
                </View>
                <Text style={styles.uploadTitle}>Photo Library</Text>
                <Text style={styles.uploadDesc}>Select from gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity accessibilityRole="button" style={styles.uploadCard} onPress={() => chooseImage(true)} disabled={loading}>
                <View style={styles.iconCircle}>
                  <Text style={styles.uploadIcon}>📷</Text>
                </View>
                <Text style={styles.uploadTitle}>Take Photo</Text>
                <Text style={styles.uploadDesc}>Open phone camera</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.promptSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.inputLabel}>Artisan Notes / Story (Optional)</Text>
            <Text style={styles.counter}>{description.length}/500</Text>
          </View>
          <Text style={styles.inputHint}>Mention materials, colors, or craft tradition. AI will turn this into bilingual descriptions.</Text>

          <TextInput
            multiline
            numberOfLines={4}
            maxLength={500}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g. Handmade red and gold silk shawl hand-loomed in Varanasi with floral borders..."
            placeholderTextColor="#9E988D"
            style={styles.input}
            textAlignVertical="top"
            editable={!loading}
          />

          <Text style={styles.suggestionTitle}>⚡ Quick Craft Suggestions (Tap to pre-fill):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionRow}>
            {CRAFT_SUGGESTIONS.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionChip}
                onPress={() => applySuggestion(item.text)}
                disabled={loading}
              >
                <Text style={styles.suggestionChipText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.primaryButton, (!imageUri || loading) ? styles.primaryButtonDisabled : null]}
          onPress={() => onContinue({ description, imageUri })}
          disabled={!imageUri || loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFF9F2" size="small" />
              <Text style={styles.primaryButtonText}>Uploading & Enhancing Image...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Continue to Photo Studio</Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAF7F2' },
  content: { paddingHorizontal: 22, paddingTop: 38, paddingBottom: 50 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8 },
  backText: { color: '#445D48', fontSize: 14, fontWeight: '700' },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: '#EDE3D2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 12 },
  stepBadgeText: { color: '#C85A32', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  title: { color: '#1E3A2F', fontSize: 28, lineHeight: 34, fontWeight: '800', marginTop: 10 },
  subtitle: { color: '#6F736D', fontSize: 14, lineHeight: 21, marginTop: 6 },
  photoContainer: { marginTop: 20 },
  uploadOptions: { flexDirection: 'row', gap: 14 },
  uploadCard: {
    flex: 1,
    minHeight: 140,
    backgroundColor: '#FFFDF9',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D8D0C3',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0E9DF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  uploadIcon: { fontSize: 22 },
  uploadTitle: { color: '#1E3A2F', fontSize: 14, fontWeight: '800' },
  uploadDesc: { color: '#888277', fontSize: 11, marginTop: 2 },
  previewWrap: { width: '100%', height: 210, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#DDD4C7', position: 'relative' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(30, 58, 47, 0.85)', padding: 10, flexDirection: 'row', justifyContent: 'center', gap: 12 },
  changeBtn: { backgroundColor: '#FFFDF9', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  changeBtnText: { color: '#1E3A2F', fontSize: 12, fontWeight: '800' },
  promptSection: { marginTop: 22 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inputLabel: { color: '#1E3A2F', fontSize: 13, fontWeight: '800' },
  counter: { color: '#9E988D', fontSize: 11, fontWeight: '700' },
  inputHint: { color: '#7E7A71', fontSize: 12, lineHeight: 17, marginTop: 3, marginBottom: 8 },
  input: { minHeight: 100, backgroundColor: '#FFFDF9', borderRadius: 14, borderWidth: 1, borderColor: '#D8D0C3', padding: 14, color: '#1E3A2F', fontSize: 14, lineHeight: 21 },
  suggestionTitle: { color: '#594A38', fontSize: 12, fontWeight: '800', marginTop: 14, marginBottom: 8 },
  suggestionRow: { flexDirection: 'row', gap: 8, paddingBottom: 6 },
  suggestionChip: { backgroundColor: '#F0E9DF', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: '#DDD4C7' },
  suggestionChipText: { color: '#4A463F', fontSize: 12, fontWeight: '700' },
  primaryButton: { backgroundColor: '#C85A32', minHeight: 56, borderRadius: 16, marginTop: 24, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: '#FFF9F2', fontSize: 16, fontWeight: '800' },
  primaryButtonArrow: { color: '#FFF9F2', fontSize: 24, fontWeight: '300' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' },
});
