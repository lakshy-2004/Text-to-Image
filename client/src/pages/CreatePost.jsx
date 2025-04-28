import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { preview } from '../assets'
import { getRandomPrompt } from '../utils'
import { FormField, Loader } from '../components'

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  })
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch(`${window.location.origin}/api/v1/post/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        })

        await response.json();
        navigate('/');
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a prompt and generate an image');
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt })
  }

  const generateImage = async (e) => {
    e.preventDefault();
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(`${window.location.origin}/api/v1/dalle/text-to-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt }),
        })

        const data = await response.json();
        setForm({ ...form, photo: data.base64 });

      } catch (error) {
        alert(error.message);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert(`Please enter a prompt`);
    }
  }

  return (
    <section className="max-w-7xl mx-auto p-4">
      <div className="text-center mb-10">
        <h1 className="font-extrabold text-[#222328] text-4xl">Create</h1>
        <p className="mt-2 text-[#666e75] text-lg max-w-xl mx-auto">
          Create imaginative and visually stunning images with text to image generator and share them with the community.
        </p>
      </div>

      <form className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <FormField
            LabelName="Your Name"
            type="text"
            name="name"
            placeholder="Lakshya Sharma"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            LabelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A fantasy landscape with flying islands"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-100 border border-gray-300 rounded-xl w-full p-4 h-72 flex justify-center items-center overflow-hidden">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-3/4 h-3/4 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 flex justify-center items-center bg-zinc-500 backdrop-blur-2xl bg-opacity-40 rounded-xl">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="button"
            onClick={generateImage}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-600 text-sm">Once you're happy with your creation, share it with the community!</p>

          <button
            type="submit"
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
          >
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost
