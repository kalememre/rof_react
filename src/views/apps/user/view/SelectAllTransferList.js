import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import { getBranches } from 'src/store/apps/branch';
import { useEffect } from 'react';
import { useState } from 'react';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

export default function SelectAllTransferList(props) {
    // ** Props
    const { storeUsers } = props
    const user = storeUsers?.user

    // ** State
    const dispatch = useDispatch()
    const storeBranches = useSelector(state => state.storeBranches)


    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState(storeBranches?.branches);
    const [right, setRight] = useState(user?.branches);




    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items?.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    useEffect(() => {
        dispatch(getBranches());
    }, [dispatch])

    useEffect(() => {
        setRight(user?.branches)
    }, [user?.branches])

    useEffect(() => {
        if (storeBranches?.branches) {
            setLeft(storeBranches.branches.filter(branch => !user?.branches?.some(userBranch => userBranch.id === branch.id)))
        }
    }, [storeBranches.branches, user?.branches]);

    const customList = (title, items) => (
        <Card sx={{
            width: '100%',
        }}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items?.length && items?.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items?.length && numberOfChecked(items) !== 0
                        }
                        disabled={items?.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items?.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: '100%',
                    height: 330,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items?.map((value) => {
                    const labelId = value.id;

                    return (
                        <ListItem
                            key={labelId}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.name} />
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={5}>{customList('Choices', left)}</Grid>
            <Grid item xs={2}>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={5}>{customList('Chosen', right)}</Grid>
        </Grid>
    );
}