import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useExamStore } from '../stores/examStore';
import { COLORS, SUBJECTS, EXAM_TYPES, GRADES } from '../constants';
import { getExamTypeLabel, getGradeLabel, getSubjectMeta } from '../utils/ui';

type RootStackParamList = {
  Upload: undefined;
  ExamDetail: { examId: string };
};

type UploadScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Upload'>;

interface Props {
  navigation: UploadScreenNavigationProp;
}

type SelectedImage = {
  uri: string;
  file?: File;
};

export default function UploadScreen({ navigation }: Props) {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [subject, setSubject] = useState('math');
  const [grade, setGrade] = useState(1);
  const [examType, setExamType] = useState('practice');
  const [isProcessing, setIsProcessing] = useState(false);
  const { isUploading } = useExamStore();
  const isLoading = isProcessing || isUploading;

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8
    });

    if (!result.canceled) {
      setImages((current) => [
        ...current,
        ...result.assets.map((asset: any) => ({
          uri: asset.uri,
          file: asset.file
        }))
      ]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('提示', '需要相机权限才能拍照');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8
    });

    if (!result.canceled) {
      const asset: any = result.assets[0];
      setImages((current) => [
        ...current,
        {
          uri: asset.uri,
          file: asset.file
        }
      ]);
    }
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleUpload = async () => {
    if (!images.length) {
      Alert.alert('提示', '请至少选择一张试卷图片');
      return;
    }

    const store = useExamStore as any;
    const uploadExam = store.getState().uploadExam;
    const formData = new FormData();
    setIsProcessing(true);

    try {
      for (let index = 0; index < images.length; index += 1) {
        const { uri, file } = images[index];
        const filename = uri.split('/').pop() || `image_${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        if (Platform.OS === 'web') {
          if (file) {
            formData.append('images', file, file.name || filename);
          } else {
            const response = await fetch(uri);
            const blob = await response.blob();
            formData.append('images', blob, filename);
          }
        } else {
          formData.append('images', {
            uri,
            name: filename,
            type
          } as any);
        }
      }

      formData.append('subject', subject);
      formData.append('grade', String(grade));
      formData.append('examType', examType);

      const newExam = await uploadExam(formData);
      setImages([]);
      navigation.navigate('ExamDetail', { examId: newExam.id });
    } catch (error: any) {
      const storeError = store.getState().error;
      Alert.alert('上传失败', storeError || error.message || '请稍后重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedSubject = getSubjectMeta(subject);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>移动端最佳体验</Text>
        <Text style={styles.heroTitle}>拍照上传比填表更重要。</Text>
        <Text style={styles.heroCopy}>按钮够大、步骤够少、图片预览足够直接，手机上单手操作也不会乱。</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>1. 采集试卷</Text>
          <Text style={styles.sectionHint}>{images.length} 张图片</Text>
        </View>

        <View style={styles.captureActions}>
          <TouchableOpacity style={[styles.captureButton, styles.capturePrimary]} onPress={takePhoto}>
            <Ionicons color={COLORS.white} name="camera" size={24} />
            <Text style={styles.capturePrimaryText}>直接拍照</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={pickImages}>
            <Ionicons color={COLORS.primaryDeep} name="images" size={22} />
            <Text style={styles.captureSecondaryText}>从相册选择</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.photoTips}>
          <Text style={styles.tipText}>建议一页一张，保持平整，光线均匀，避免手指遮挡边缘。</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
          {images.map((image, index) => (
            <View key={image.uri + index} style={styles.previewCard}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                <Ionicons color={COLORS.white} name="close" size={14} />
              </TouchableOpacity>
            </View>
          ))}
          {!images.length && (
            <View style={styles.emptyPreview}>
              <Ionicons color={COLORS.textSecondary} name="image-outline" size={26} />
              <Text style={styles.emptyPreviewText}>图片会显示在这里</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>2. 补充信息</Text>
          <Text style={styles.sectionHint}>上传后再手动触发分析</Text>
        </View>

        <Text style={styles.fieldLabel}>学科</Text>
        <View style={styles.optionGrid}>
          {SUBJECTS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.subjectOption,
                subject === item.id && { backgroundColor: item.color, borderColor: item.color }
              ]}
              onPress={() => setSubject(item.id)}
            >
              <Text style={[styles.subjectOptionIcon, subject === item.id && styles.activeText]}>{item.icon}</Text>
              <Text style={[styles.subjectOptionText, subject === item.id && styles.activeText]}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>年级</Text>
        <View style={styles.optionWrap}>
          {GRADES.slice(0, 9).map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.chip, grade === item.value && styles.chipActive]}
              onPress={() => setGrade(item.value)}
            >
              <Text style={[styles.chipText, grade === item.value && styles.activeText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.fieldLabel}>试卷类型</Text>
        <View style={styles.optionWrap}>
          {EXAM_TYPES.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.chip, examType === item.value && styles.chipActive]}
              onPress={() => setExamType(item.value)}
            >
              <Text style={[styles.chipText, examType === item.value && styles.activeText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>3. 先上传试卷</Text>
          <View style={[styles.subjectBadge, { backgroundColor: selectedSubject.color }]}>
            <Text style={styles.subjectBadgeText}>{selectedSubject.name}</Text>
          </View>
        </View>
        <Text style={styles.summaryText}>
          {getGradeLabel(grade)} · {getExamTypeLabel(examType)} · {images.length || 0} 张图片。上传后会进入试卷详情页，再由你决定是否开始分析。
        </Text>
        <TouchableOpacity
          style={[styles.submitButton, (isLoading || !images.length) && styles.buttonDisabled]}
          onPress={handleUpload}
          disabled={isLoading || !images.length}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>上传试卷</Text>
              <Ionicons color={COLORS.white} name="arrow-forward" size={18} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 14
  },
  hero: {
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    padding: 22
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D7E6E8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 10
  },
  heroCopy: {
    fontSize: 14,
    lineHeight: 20,
    color: '#D7E6E8'
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 26,
    padding: 18,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text
  },
  sectionHint: {
    fontSize: 13,
    color: COLORS.textSecondary
  },
  captureActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12
  },
  captureButton: {
    flex: 1,
    minHeight: 110,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 12
  },
  capturePrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  capturePrimaryText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800'
  },
  captureSecondaryText: {
    color: COLORS.primaryDeep,
    fontSize: 15,
    fontWeight: '700'
  },
  photoTips: {
    backgroundColor: COLORS.background,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14
  },
  tipText: {
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontSize: 13
  },
  previewRow: {
    gap: 12
  },
  previewCard: {
    width: 112,
    height: 148,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.surfaceStrong
  },
  previewImage: {
    width: '100%',
    height: '100%'
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(31,26,23,0.75)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyPreview: {
    width: 180,
    height: 148,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    gap: 10
  },
  emptyPreviewText: {
    color: COLORS.textSecondary,
    fontSize: 13
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 6,
    marginBottom: 10
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8
  },
  subjectOption: {
    width: '31%',
    minHeight: 86,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceStrong,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8
  },
  subjectOptionIcon: {
    color: COLORS.primaryDeep,
    fontSize: 20,
    fontWeight: '800'
  },
  subjectOptionText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700'
  },
  optionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceStrong,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  chipText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700'
  },
  activeText: {
    color: COLORS.white
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 26,
    padding: 18
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  summaryTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text
  },
  subjectBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999
  },
  subjectBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700'
  },
  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16
  },
  submitButton: {
    minHeight: 58,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800'
  },
  buttonDisabled: {
    opacity: 0.5
  }
});
