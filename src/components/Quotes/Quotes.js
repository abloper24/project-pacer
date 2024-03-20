import "./Quotes.scss";
import axios from "axios";
import { useEffect, useState } from 'react'


function Quotes() {

    //need to figure out how to remove the <p></p> of the quote api
    //will the random work? 

    const [quote, setQuote] = useState({ content: '', author: '' });

    useEffect(() => {
        const getQuote = async () => {
            try {
                const response = await axios.get(`https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand&_=${new Date().getTime()}`);
                // console.log(response.data[0].content.rendered)
                if (response.data && response.data.length > 0) {
                    const randomQuote = response.data[0];
                    const contentWithoutPTags = randomQuote.content.rendered.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');
                    setQuote({
                        content: contentWithoutPTags,
                        author: randomQuote.title.rendered,
                    });
                }

            } catch (error) {
                console.error('Error getting quote:', error);
            }
        };

        getQuote();
    }, []);

    if (!quote.content) {
        return <div><p>Loading...</p></div>;
    }


    return (
        <>
            <section>
                <h2>Daily Dose of Wisdom</h2>
                <p>{quote.content}</p>
                <p>{quote.author}</p>
            </section>
        </>
    )
}

export default Quotes;