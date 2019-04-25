import React from 'react';

export default class VideoList extends React.Component {
    render() {
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
                                <td><button video-item-id={v.id}>Play</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }

    componentDidMount() {
        if (this.props.onSelectedItemIdChanged) {
            this._setEvent();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.videos !== this.props.videos) {
            this._setEvent();
        }

        if (prevProps.onSelectedItemIdChanged !== this.props.onSelectedItemIdChanged) {
            document.querySelectorAll('table tr td button[video-item-id]').forEach(btn => btn.removeEventListener('click'));
            if (this.props.onSelectedItemIdChanged) {
                this._setEvent();
            }
        }
    }

    _setEvent() {
        const onSelectedItemIdChanged = this.props.onSelectedItemIdChanged;

        document.querySelectorAll('table tr td button[video-item-id]').forEach(btn => btn.addEventListener('click', function () {
            onSelectedItemIdChanged(this.getAttribute('video-item-id'));
        }));
    }
}