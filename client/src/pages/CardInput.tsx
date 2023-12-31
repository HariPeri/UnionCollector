/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MdCloudUpload } from 'react-icons/md';
import Navbar from '../shared/Navbar';
import HText from '../shared/HText';
import useAuthContext from '../hooks/useAuthContext';
import Footer from '../shared/Footer';

function CardInput() {
    const inputStyles =
        ' mb-2 rounded-lg bg-blue-400 px-5 py-3 placeholder-white text-white';
    const [frontCardImage, setFrontCardImage] = useState<any>('');
    const [backCardImage, setBackCardImage] = useState<any>('');
    const [playerName, setPlayerName] = useState('');
    const [year, setYear] = useState('');
    const [cardSet, setCardSet] = useState('');
    const [cardType, setCardType] = useState('');
    const [color, setColor] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardNumberedOutOf, setCardNumberedOutof] = useState('');
    const [orientation, setOrientation] = useState<string>('');
    const [players, setPlayers] = useState([]);

    const navigate = useNavigate();

    const {
        state: { user },
    } = useAuthContext();

    function convertToBase64Front(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        if (e.target.files!.length > 0) {
            reader.readAsDataURL(e.target.files![0]);
            reader.onload = () => {
                // console.log(reader.result);
                setFrontCardImage(reader.result);
            };
        }
        /* reader.onerror = (error) => {
            //console.log('Error: ', error);
        }; */
    }

    function convertToBase64Back(e: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        if (e.target.files!.length > 0) {
            reader.readAsDataURL(e.target.files![0]);
            reader.onload = () => {
                // console.log(reader.result);
                setBackCardImage(reader.result);
            };
        }

        /* reader.onerror = (error) => {
            console.log('Error: ', error);
        }; */
    }

    // Fetches the Players
    useEffect(() => {
        // Only happens on first render [empty Dependencies array]
        async function fetchPlayers() {
            const res = await fetch('http://localhost:3001/players');
            const newPlayers = await res.json();
            setPlayers(newPlayers);
        }

        fetchPlayers();
    }, []);

    // Use Effect that navigates to page when playerName changes
    useEffect(() => {
        // Check if the selected option should trigger navigation
        if (playerName === 'redirect') {
            navigate('/add-player');
        }
    }, [playerName, navigate]);

    const {
        register,
        trigger,
        formState: { errors },
    } = useForm();

    async function handleCreateCard(e: React.FormEvent) {
        e.preventDefault(); // This is done so that we don't refresh the page and lose all of our data

        if (!user) {
            return;
        }

        const isValid = await trigger();

        if (isValid) {
            const date: Date = new Date();
            const currentDay = String(date.getDate()).padStart(2, '0');
            const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
            const currentYear = date.getFullYear();

            const dateAcquired = `${currentMonth}/${currentDay}/${currentYear}`;

            // (frontCardImage, backCardImage);

            const cardResponse = await fetch('http://localhost:3001/cards', {
                // First arg is url and second arg is some data like what type of request and the body [must be stringified]
                method: 'POST',
                body: JSON.stringify({
                    frontCardImage,
                    backCardImage,
                    year,
                    playerName,
                    cardSet,
                    cardType,
                    color,
                    cardNumber,
                    cardNumberedOutOf,
                    dateAcquired,
                    orientation,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const card = await cardResponse.json();
            const cardID = card._id; // Assuming the response contains the _id of the newly created card

            await fetch('http://localhost:3001/players', {
                // First arg is url and second arg is some data like what type of request and the body [must be stringified]
                method: 'POST',
                body: JSON.stringify({
                    playerName,
                    cardID,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            });

            navigate('/');
        }
    }

    return (
        <div className="h-100%">
            <Navbar />
            <div className="mt-10 w-1/2 mx-auto">
                <div className="text-center mb-8">
                    <HText> Add a New Card </HText>
                </div>
                <form
                    className="md:grid grid-cols-2 gap-4"
                    onSubmit={handleCreateCard}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <div className="relative h-64 mb-2 rounded-lg bg-blue-400">
                                <input
                                    className="absolute opacity-0 h-full w-full z-[1] cursor-pointer"
                                    type="file"
                                    accept="image/*"
                                    placeholder="cardImage"
                                    {...register('cardImage', {
                                        validate: {
                                            lessthan10mb: (files) =>
                                                files[0]?.size < 50000 ||
                                                'Max 50kb',
                                        },
                                    })}
                                    onChange={convertToBase64Front}
                                />
                                <div className="py-20 flex flex-col justify-center text-center items-center text-white">
                                    {frontCardImage ? (
                                        <p> </p>
                                    ) : (
                                        <p> Browse Files to Upload </p>
                                    )}
                                    {frontCardImage ? (
                                        <img
                                            className="absolute top-4"
                                            width={160}
                                            height={350}
                                            src={frontCardImage}
                                            alt={frontCardImage}
                                        />
                                    ) : (
                                        <MdCloudUpload className="h-16 w-16" />
                                    )}
                                </div>
                            </div>

                            {errors.cardImage && (
                                <p className=" text-primary-500 text-center">
                                    {errors.cardImage.type === 'lessthan10mb' &&
                                        'Please input a front image'}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <div className="relative h-64 mb-2 rounded-lg bg-blue-400">
                                <input
                                    className="absolute opacity-0 h-full w-full z-[1] cursor-pointer"
                                    type="file"
                                    accept="image/*"
                                    placeholder="cardImage2"
                                    {...register('cardImage2', {
                                        validate: {
                                            lessthan10mb: (files) =>
                                                files[0]?.size < 50000 ||
                                                'Max 50kb',
                                        },
                                    })}
                                    onChange={convertToBase64Back}
                                />
                                <div className="py-20 flex flex-col justify-center text-center items-center text-white">
                                    {backCardImage ? (
                                        <p> </p>
                                    ) : (
                                        <p> Browse Files to Upload </p>
                                    )}
                                    {backCardImage ? (
                                        <img
                                            className="absolute top-4"
                                            width={160}
                                            height={350}
                                            src={backCardImage}
                                            alt={backCardImage}
                                        />
                                    ) : (
                                        <MdCloudUpload className="h-16 w-16" />
                                    )}
                                </div>
                            </div>

                            {errors.cardImage2 && (
                                <p className=" text-primary-500 text-center">
                                    {errors.cardImage2.type ===
                                        'lessthan10mb' &&
                                        'Please input a back image!'}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <input
                                className={inputStyles}
                                value={cardNumber}
                                type="text"
                                placeholder="CARD NUMBER"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setCardNumber(e.target.value);
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <input
                                className={inputStyles}
                                value={cardNumberedOutOf}
                                type="text"
                                placeholder="CARD NUM OUT OF"
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setCardNumberedOutof(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mb-2">
                        <select
                            className={`${inputStyles} border-r-8 border-transparent`}
                            value={playerName}
                            {...register('player', {
                                required: true,
                            })}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                                setPlayerName(e.target.value);
                            }}
                        >
                            <option value=""> CHOOSE A PLAYER </option>
                            {players?.map((player: any) => (
                                <option
                                    value={player.playerName}
                                    key={player._id}
                                >
                                    {player.playerName}
                                </option>
                            ))}
                            <option value="redirect">ADD A PLAYER</option>
                        </select>
                        {errors.player && (
                            <p className=" text-primary-500">
                                {errors.player.type === 'required' &&
                                    'This field is required'}
                            </p>
                        )}

                        <input
                            className={inputStyles}
                            id="cardandplayerInput-autofill-input"
                            value={year}
                            type="text"
                            placeholder="YEAR"
                            {...register('year', {
                                required: true,
                                maxLength: 100,
                            })}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setYear(e.target.value);
                            }}
                        />

                        {errors.year && (
                            <p className=" text-primary-500">
                                {errors.year.type === 'required' &&
                                    'This field is required.'}
                                {errors.year.type === 'maxLength' &&
                                    'Max Length is 100 characters.'}
                            </p>
                        )}

                        <select
                            className={`${inputStyles} border-r-8 border-transparent`}
                            value={orientation}
                            {...register('orientation', {
                                required: true,
                            })}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                                setOrientation(e.target.value);
                            }}
                        >
                            <option value=""> Choose an Orientation </option>
                            <option value="vertical">Vertical</option>
                            <option value="horizontal">Horizontal</option>
                        </select>

                        {errors.orientation && (
                            <p className=" text-primary-500">
                                {errors.orientation.type === 'required' &&
                                    'This field is required'}
                            </p>
                        )}

                        <input
                            className={inputStyles}
                            id="cardandplayerInput-autofill-input"
                            value={cardSet}
                            type="text"
                            placeholder="CARD SET"
                            {...register('cardset', {
                                required: true,
                                maxLength: 100,
                            })}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setCardSet(e.target.value);
                            }}
                        />
                        {errors.cardset && (
                            <p className=" text-primary-500">
                                {errors.cardset.type === 'required' &&
                                    'This field is required.'}
                                {errors.cardset.type === 'maxLength' &&
                                    'Max Length is 100 characters.'}
                            </p>
                        )}
                        <input
                            className={inputStyles}
                            id="cardandplayerInput-autofill-input"
                            value={cardType}
                            type="text"
                            placeholder="CARD TYPE"
                            {...register('cardtype', {
                                required: true,
                                maxLength: 100,
                            })}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setCardType(e.target.value);
                            }}
                        />
                        {errors.cardtype && (
                            <p className=" text-primary-500">
                                {errors.cardtype.type === 'required' &&
                                    'This field is required.'}
                                {errors.cardtype.type === 'maxLength' &&
                                    'Max Length is 100 characters.'}
                            </p>
                        )}
                        <input
                            className={inputStyles}
                            id="cardandplayerInput-autofill-input"
                            value={color}
                            type="text"
                            placeholder="COLOR"
                            {...register('cardcolor', {
                                required: true,
                                maxLength: 100,
                            })}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setColor(e.target.value);
                            }}
                        />
                        {errors.cardcolor && (
                            <p className=" text-primary-500">
                                {errors.cardcolor.type === 'required' &&
                                    'This field is required.'}
                                {errors.cardcolor.type === 'maxLength' &&
                                    'Max Length is 100 characters.'}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="md:w-64 sm:w-full xs:w-full mb-48 bg-white mx-auto hover:text-white border-black border-2 p-3 rounded-md hover:bg-blue-600 transition-all duration-500"
                    >
                        Create Card
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default CardInput;
