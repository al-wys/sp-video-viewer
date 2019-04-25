import React from 'react';

export default class VideoList extends React.Component {
    render() {
        const onItemIdChanged = this.props.onSelectedItemIdChanged;
        const getClickHandler = onItemIdChanged ? (id) => {
            return () => onItemIdChanged(id);
        } : () => { };

        return (
            <table>
                {this.props.videos.length ? (
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>URL</th>
                            <th>Created</th>
                            <th></th>
                        </tr>
                    </thead>
                ) : <></>}
                <tbody>
                    {this.props.videos.map((v, i) => {
                        return (
                            <tr key={i}>
                                <td>{v.name}</td>
                                <td>{v.webUrl}</td>
                                <td>{new Date(v.createdDateTime).toLocaleDateString()}</td>
                                <td><button onClick={getClickHandler(v.id)}>Play</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }
}