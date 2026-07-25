import os
import fitz  # PyMuPDF
import boto3
from dotenv import load_dotenv

# Load credentials from .env.local
load_dotenv('.env.local')

R2_ACCOUNT_ID = os.getenv('R2_ACCOUNT_ID')
R2_ACCESS_KEY_ID = os.getenv('R2_ACCESS_KEY_ID')
R2_SECRET_ACCESS_KEY = os.getenv('R2_SECRET_ACCESS_KEY')
R2_BUCKET_NAME = os.getenv('R2_BUCKET_NAME', 'wedding-photos')

pdf_path = '/Users/santhoshsanthosh/Downloads/Ambika Santhosh Wedding 2.pdf'

s3 = boto3.client(
    's3',
    endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
    region_name='auto'
)

def extract_and_upload():
    print(f"Opening {pdf_path}...")
    doc = fitz.open(pdf_path)
    print(f"Found {len(doc)} pages.")
    
    # Use a zoom matrix for high quality
    zoom = 2.0 
    mat = fitz.Matrix(zoom, zoom)

    for page_num in range(len(doc)):
        print(f"Processing page {page_num + 1}/{len(doc)}...")
        page = doc.load_page(page_num)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        
        # Save to bytes
        img_bytes = pix.tobytes("jpeg")
        
        # Upload to R2
        key = f"album/page_{page_num + 1:03d}.jpg"
        print(f"  Uploading to {key}...")
        
        s3.put_object(
            Bucket=R2_BUCKET_NAME,
            Key=key,
            Body=img_bytes,
            ContentType='image/jpeg'
        )
        print(f"  Uploaded page {page_num + 1}.")
        
    print("Done!")

if __name__ == '__main__':
    extract_and_upload()
