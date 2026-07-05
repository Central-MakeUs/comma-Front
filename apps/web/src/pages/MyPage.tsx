import * as styles from './MyPage.css';
import { Icon, SmallButton, ImageUpload, NavigationBar } from '@comma/design-system';

function MyPage() {
    return (
        <div>
            <div>
                <span>마이페이지</span>
                <Icon name='setting'/>
            </div>
            <div>
                <div>
                    <span>꿈꾸는 소녀</span>
                    <span>마지막 쉼표 3시간 전</span>
                </div>
                <SmallButton label='닉네임 수정'/>
            </div>
            <div>
                <ImageUpload />
                <ImageUpload />
            </div>
            <div>
                <div><span>Q1.</span>지금 기분이 어때요?</div>
                <div>
                    <div>
                        <span>#1</span> 멍하고 싶어
                    </div>
                    <div>
                        <div>
                            <div />
                        </div>
                        <span>55%</span>
                    </div>
                    <div>
                        <span>#2</span> 기분 전환이 필요해
                    </div>
                    <div>
                        <div>
                            <div />
                        </div>
                        <span>35%</span>
                    </div>
                    <div>
                        <span>#3</span> 가볍게 해볼 수 있어
                    </div>
                    <div>
                        <div>
                            <div />
                        </div>
                        <span>10%</span>
                    </div>
                </div>
                <div><span>Q2.</span>어느정도 시간이 있어요?</div>
                <div>
                    <div>
                        <span>#1</span> 잠깐(1시간 이내)
                    </div>
                    <div>
                        <div>
                            <div />
                        </div>
                        <span>70%</span>
                    </div>
                    <div>
                        <span>#2</span> 여유(1-6시간 이내)
                    </div>
                    <div>
                        <div>
                            <div />
                        </div>
                        <span>25%</span>
                    </div>
                    <div>
                        <span>#3</span> 넉넉(6시간이상)
                    </div>
                    <div>
                        <div>
                            <div />
                        </div>
                        <span>5%</span>
                    </div>
                </div>
            </div>
            <NavigationBar active='mypage'/>
        </div>
    )
}

export default MyPage;