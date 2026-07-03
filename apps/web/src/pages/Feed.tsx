import * as styles from './Feed.css';
import { Icon, NavigationBar, Chip, FeedCard } from '@comma/design-system';
import { useState } from 'react';

const feelCat = [
    '전체',
    '멍하고 싶어',
    '기분 전환이 필요해',
    '가볍게 해볼 수 있어',
]

const bodyStateCat = [
    '전체',
    '완전 방전이야',
    '견딜 만해',
    '안 피곤해',
]

const restCat = [
    '아무것도 안하고 싶어',
    '조용히 혼자 있고 싶어',
    '몸을 움직이고 싶어',
]

type fieldType = 'feel' | 'body' | 'rest';

interface ICategoryModal {
    field: fieldType,
    onClick: (arg0:string) => void,
}

function CategoryModal({ field, onClick }: ICategoryModal) {
    return (
        <div className={styles.chipModal}>
            {field == 'feel' ? (
                feelCat.map((f, i) => (
                    <div key={i} style={{padding: '8px 16px'}} onClick={() => onClick(f)}>{f}</div>
                ))
            ) : field == 'body' ? (
                bodyStateCat.map((b, i) => (
                    <div key={i} style={{padding: '8px 16px'}} onClick={() => onClick(b)}>{b}</div>
                ))
            ) : (
                restCat.map((r, i) => (
                    <div key={i} style={{padding: '8px 16px'}} onClick={() => onClick(r)}>{r}</div>
                ))
            )}
        </div>
    )
}

function Feed() {
    const [feelOpen, setFeelOpen] = useState(false);
    const [bodyOpen, setBodyOpen] = useState(false);
    const [restOpen, setRestOpen] = useState(false);

    const [currentFeel, setCurrentFeel] = useState('기분');
    const [currentBody, setCurrentBody] = useState('몸 상태');
    const [currentRest, setCurrentRest] = useState('휴식');

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <span className={styles.headerText}>
                    오늘 아직 쉬지 못했어요.<br />잠깐 쉼표 찍으러 갈까요?
                </span>
                <span className={styles.headerLink}>휴식하기 <Icon name='rightArrow'/></span>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{width: '100%'}}>
                    <div className={styles.title}>피드</div>
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%', paddingTop: 8, paddingBottom: 16, paddingLeft: 24, paddingRight: 24, gap: 8}}>
                        <div style={{position: 'relative'}}>
                            <Chip label={currentFeel} state={feelOpen? 'selected' : 'default'} onClick={() => {
                                setFeelOpen(prev => !prev);
                                setBodyOpen(false);
                                setRestOpen(false);
                            }}/>
                            {feelOpen? <CategoryModal field='feel' onClick={(cat) => {
                                setCurrentFeel(cat);
                                setFeelOpen(false);
                            }}/> : null}
                        </div>
                        <div style={{position: 'relative'}}>
                            <Chip label={currentBody} state={bodyOpen? 'selected' : 'default'} className={styles.secondChip} onClick={() => {
                                setBodyOpen(prev => !prev);
                                setFeelOpen(false);
                                setRestOpen(false);
                            }}/>
                            {bodyOpen? <CategoryModal field='body' onClick={(cat) => {
                                setCurrentBody(cat);
                                setBodyOpen(false);
                            }}/> : null}
                        </div>
                        <div style={{position: 'relative'}}>
                            <Chip label={currentRest} state={restOpen? 'selected' : 'default'} onClick={() => {
                                setRestOpen(prev => !prev);
                                setFeelOpen(false);
                                setBodyOpen(false);
                            }}/>
                            {restOpen? <CategoryModal field='rest' onClick={(cat) => {
                                setCurrentRest(cat);
                                setRestOpen(false);
                            }}/> : null}
                        </div>
                    </div>
                </div>
                <div className={styles.scrollContainer}>
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                </div>
            </div>
            <NavigationBar active='feed' className={styles.navBarStyle}/>
        </div>
    );
}

export default Feed;
