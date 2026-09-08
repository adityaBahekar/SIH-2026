import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { DraftProduct } from '../types';

interface CreateProductScreenProps {
  onBack: () => void;
  onContinue: (draft: DraftProduct) => void;
  loading?: boolean;
}

export function CreateProductScreen({ onBack, onContinue, loading = false }: CreateProductScreenProps) {
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const chooseImage = async (useCamera: boolean): Promise<void> => {
    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TouchableOpacity accessibilityRole="button" onPress={onBack} style={styles.backButton} disabled={loading}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.kicker}>STEP 1 OF 4</Text>
        <Text style={styles.title}>Tell us about your product</Text>
        <Text style={styles.subtitle}>Start with a clear photo. Then add anything you already know about your craft.</Text>

        <TouchableOpacity accessibilityRole="button" style={[styles.photoButton, imageUri ? styles.photoButtonSelected : null]} onPress={() => chooseImage(false)} disabled={loading}>
          {imageUri ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <View style={styles.changeOverlay}>
                <Text style={styles.changeOverlayText}>Change photo</Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.photoIcon}>＋</Text>
              <Text style={styles.photoTitle}>Add a product photo</Text>
              <Text style={styles.photoHint}>Tap for photo library</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" style={styles.cameraButton} onPress={() => chooseImage(true)} disabled={loading}>
          <Text style={styles.cameraText}>Use camera instead</Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>What would you like people to know? (Optional)</Text>
        <TextInput
          multiline
          numberOfLines={4}
          maxLength={500}
          value={description}
          onChangeText={setDescription}
          placeholder="Example: This is a handmade red cotton bag made using traditional stitching."
          placeholderTextColor="#9A968D"
          style={styles.input}
          textAlignVertical="top"
          editable={!loading}
        />
        <Text style={styles.counter}>{description.length}/500</Text>

        <TouchableOpacity
          accessibilityRole="button"
          style={[styles.primaryButton, loading ? styles.primaryButtonDisabled : null]}
          onPress={() => onContinue({ description, imageUri })}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFF9F2" size="small" />
              <Text style={styles.primaryButtonText}>Uploading photo...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.primaryButtonText}>Continue</Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F3EC' },
  content: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 8 },
  backText: { color: '#53665A', fontSize: 15, fontWeight: '700' },
  kicker: { color: '#D96C45', fontSize: 12, fontWeight: '800', letterSpacing: 1.1, marginTop: 18 },
  title: { color: '#263B35', fontSize: 32, lineHeight: 38, fontWeight: '800', marginTop: 10 },
  subtitle: { color: '#6F736D', fontSize: 16, lineHeight: 24, marginTop: 12 },
  photoButton: { minHeight: 160, borderRadius: 18, borderWidth: 1.5, borderColor: '#B5C6B5', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 24, backgroundColor: '#EEF3E9', overflow: 'hidden' },
  photoButtonSelected: { borderStyle: 'solid', borderColor: '#53725C' },
  previewWrap: { width: '100%', height: 160, position: 'relative' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  changeOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(38, 59, 53, 0.75)', paddingVertical: 8, alignItems: 'center' },
  changeOverlayText: { color: '#FFF9F2', fontSize: 13, fontWeight: '700' },
  photoIcon: { color: '#53725C', fontSize: 32, lineHeight: 34, fontWeight: '300' },
  photoTitle: { color: '#355544', fontSize: 16, fontWeight: '800', marginTop: 8 },
  photoHint: { color: '#7B887A', fontSize: 13, marginTop: 5 },
  cameraButton: { alignSelf: 'center', paddingVertical: 10 },
  cameraText: { color: '#53665A', fontSize: 13, fontWeight: '700' },
  inputLabel: { color: '#263B35', fontSize: 15, fontWeight: '800', marginTop: 20, marginBottom: 9 },
  input: { minHeight: 110, backgroundColor: '#FFFDF9', borderRadius: 14, borderWidth: 1, borderColor: '#DED8CF', padding: 15, color: '#263B35', fontSize: 15, lineHeight: 22 },
  counter: { color: '#9A968D', fontSize: 12, textAlign: 'right', marginTop: 5 },
  primaryButton: { backgroundColor: '#D96C45', minHeight: 58, borderRadius: 16, marginTop: 24, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButtonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: '#FFF9F2', fontSize: 17, fontWeight: '800' },
  primaryButtonArrow: { color: '#FFF9F2', fontSize: 26, fontWeight: '300' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' },
});
