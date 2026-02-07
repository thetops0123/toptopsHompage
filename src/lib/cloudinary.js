export const uploadToCloudinary = async (file) => {
	const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
	const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

	if (!cloudName || !uploadPreset) {
		throw new Error('Cloudinary env vars are missing.');
	}

	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', uploadPreset);

	// 파일 타입에 따라 적절한 엔드포인트 사용
	const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
	const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

	const response = await fetch(uploadUrl, {
		method: 'POST',
		body: formData,
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data?.error?.message || 'Cloudinary upload failed');
	}

	return data.secure_url;
};
