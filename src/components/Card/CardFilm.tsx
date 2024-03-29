import {
    Card, CardMedia,
} from "@mui/material";
import {PremiumTag} from "../Tag/PremiumTag";

export const CardFilm = ({
                             src,
                             onClick,
                             title,
                             premium,
                         }: any) => {
    return (
        <>
            <Card
                title={title}
                onClick={onClick}
                sx={{
                    boxShadow: 5,
                    borderRadius: 4,
                    display: 'flex',
                    m: 2,
                    ":hover": {
                        boxShadow: 20,
                        cursor: "pointer",
                    },
                    minWidth: 200,
                    height: 300
                }}
            >
                <CardMedia
                    component={"img"}
                    image={src}
                />
            </Card>
            {premium ? <PremiumTag/> : null
            }
        </>
    );
};
