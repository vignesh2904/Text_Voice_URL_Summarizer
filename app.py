from flask import Flask, request, jsonify, render_template
import openai
import whisper
import os
from pydub import AudioSegment
import requests
from bs4 import BeautifulSoup
from key import API_key
app = Flask(__name__)

# Set OpenAI API key
openai.api_key = API_key

# Define paths
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def convert_audio_format(audio_file):
    """
    Convert audio file to WAV format using pydub.
    """
    audio = AudioSegment.from_file(audio_file)
    audio = audio.set_frame_rate(16000)  # Adjust frame rate if necessary
    audio.export("temp_audio.wav", format="wav")
    return "temp_audio.wav"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/voice')
def voice_page():
    return render_template('voice.html')

@app.route('/text')
def text_page():
    return render_template('text.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' in request.files and request.files['file'].filename != '':
        file = request.files['file']
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        
        # Convert any audio file to WAV format
        if not file.filename.endswith('.wav'):
            file_path = convert_audio_format(file_path)
        
        return transcribe_and_summarize(file_path)
    
    elif 'textFile' in request.files and request.files['textFile'].filename != '':
        text_file = request.files['textFile']
        text = text_file.read().decode('utf-8')
        return summarize_text(text)

    return jsonify({'error': 'Invalid input. Please upload a valid audio or text file for summarization.'}), 400
@app.route('/upload-url', methods=['POST'])
def upload_url():
    url = request.form.get('textUrl')
    if url:
        text = extract_text_from_url(url)
        if text:
            return summarize_text(text)
        else:
            return jsonify({'error': 'Error fetching the URL content.'}), 400
    return jsonify({'error': 'Invalid URL. Please provide a valid URL for summarization.'}), 400

def extract_text_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        paragraphs = soup.find_all('p')
        text = ' '.join([para.get_text() for para in paragraphs])
        return text
    except requests.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return None
def transcribe_and_summarize(file_path):
    try:
        # Load Whisper model
        print("Loading Whisper model...")
        whisper_model = whisper.load_model("base")

        # Transcribe audio file
        print("Transcribing audio file...")
        result = whisper_model.transcribe(file_path)

        # Get the transcription text
        transcription_text = result['text']
        print("Transcription Text:", transcription_text)

        return summarize_text(transcription_text)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def summarize_text(text):
    try:
        # Setting prompt for summarization
        prompt = """Summarize the following text in a concise, clear manner, ensuring that all main ideas and significant details 
        are captured. The summary should be easy to understand and in the same language as the original text. Emphasize the key points 
        and important information, making it both informative and coherent. Additionally, provide a proper conclusion to the summary. 
        Leave the summarization complete by ending it with a proper fullstop.\n\n
        """
     # Concatenate prompt and input text
        input_text = prompt + text

        # Call OpenAI API for summarization using ChatCompletion
        print("Summarizing text using OpenAI API...")
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You:"},
                {"role": "user", "content": input_text}
            ],
            #max_tokens=150
        )

        # Get the summarized text from the response
        summarized_text = response['choices'][0]['message']['content'].strip()

        # Return the summarized text as JSON response
        return jsonify({'Summary': summarized_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)