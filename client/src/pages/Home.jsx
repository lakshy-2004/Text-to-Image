import React, {useState, useEffect} from 'react'

import {Loader, Card, FormField} from '../components';


const RenderCard = ({data, title}) => {
  if(data?.length >0){
    return data.map((post) => <Card key={post._id} {...post} />)
  }
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">
      {title}
    </h2>
  )
}

const Home = () => {

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${window.location.origin}/api/v1/post/get`,
          {
            method: 'GET',
            headers:{
              'Content-Type': 'application/json', 
            },
          }
        )
        if(response.ok){
          const result = await response.json();

          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error.message);
      } finally{
        setLoading(false);
      }
    }
    fetchPosts();

  }, [])

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));
        setSearchedResults(searchResult);
      }, 500),
    );
  };

  

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
        Browse through a collection of imaginative and visually stunning images.
        </p>
        
      </div>

      <div className='mt-16 '>
        <FormField 
        LabelName='Search posts'
        type='text'
        name='text'
        placeholder='Search Posts'
        value={searchText}
        handleChange={handleSearchChange}
        />
      </div>

      <div className="mt-10">
        {
          loading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ):(
            <>
            {
              searchText && (
                <h2 className="font-medium text-[#666e75] text-xl mb-3">
                  Showing results for <span className="text-[#222328]"> {searchText} </span>
                </h2>
              )
            }
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-3'>
              {
                searchText ?(
                  <RenderCard
                    data={searchedResults} 
                    title="No search results found"
                  />
                ):(
                  <RenderCard
                    data={allPosts} 
                    title="No posts found"
                  />
                )
              }
            </div>
            </>
          )

        }
      </div>

    </section>
  )
}

export default Home