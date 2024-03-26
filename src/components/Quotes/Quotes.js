import "./Quotes.scss";
import axios from "axios";
import { useEffect, useState } from 'react'


function Quotes() {

    const [quote, setQuote] = useState({ content: '', author: '' });

    useEffect(() => {
        const getQuote = async () => {
            try {
                const response = await axios.get(`https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand&_=${new Date().getTime()}`);
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
        return <div><p>Loading quotes...</p></div>;
    }


    return (
        <>
            <section className="quotes">
                <h2 className="quotes__title">Daily Dose of Wisdom</h2>
                <p className="quotes__content">{quote.content}</p>
                <p className="quotes__author">By {quote.author}</p>
            </section>
        </>
    )
}

export default Quotes;