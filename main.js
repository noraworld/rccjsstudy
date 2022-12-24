enchant();//準備


window.onload=windowLoad;

function windowLoad(){
	var game=new Game(320,480);//画面サイズ(横:320 縦:480)
	game.fps=60;//ゲームのフレームレート(1秒間に60回)

	//ゲームに使う画像の読み込み
	/* ここに入力1 (プレイヤーの画像の読み込み)*/
  game.preload("player.png");//プレイヤー
	game.preload("enemy.png");//敵キャラ
	game.preload("shot1.png");//プレイヤーの攻撃その1
	game.preload("shot2.png");//プレイヤーの攻撃その2
	game.preload("bullet.png");//敵の攻撃
	game.preload("win.png");//ゲームクリアの文字
	game.preload("lose.png");//ゲームオーバー文字





	//キーボードの登録

	/* ここに入力2 ボタン設定 */
// キーボードのzをゲームのAボタンにする
game.keybind(90, "a");
// キーボードのxをゲームのBボタンにする
game.keybind(88, "b");

	//ゲームの起動準備
	game.onload=function()
	{
		//ゲームクリア時に表示する文字
		var win=new Sprite(158,51);//文字の大きさ
		win.image=game.assets["win.png"];
		win.x=80;
		win.y=60;

		//ゲームオーバー時に表示する文字
		var lose=new Sprite(158,51);
		lose.image=game.assets["lose.png"];
		lose.x=80;
		lose.y=60;


		//ここからプレイヤーの設定
		var player=new Sprite(25,27);//プレイヤーの大きさ
		player.image=game.assets["player.png"];//使う画像
		//プレイヤーの位置
		player.x=110;
		player.y=400;

		//プレイヤーの体力
		player.hp=20;

		//プレイヤーの行動
		player.addEventListener(enchant.Event.ENTER_FRAME,function(){
			/* ここに入力3 */
			if(game.input.up)this.moveBy(0,-1);//上
			if(game.input.down)this.moveBy(0,1);//下
			if(game.input.left)this.moveBy(-1,0);//左
			if(game.input.right)this.moveBy(1,0);//右
			//画面外に出ようとすると止める
			if(player.x<10)player.x=10;
			if(player.x>290)player.x=290;
			if(player.y<30)player.y=30;
			if(player.y>430)player.y=430;

			//zキー(Aボタン)で弾を発射する
			if(game.input.a)
			{
				AddShot01(game,player);
			}
			//zキー(Aボタン)が押されていなくて，
			//xキー(Bボタン)が押されていると，別の弾を発射する
			else if(game.input.b)
			{
				AddShot02(game,player);
			}


			//体力がなくなったか確認
			if(this.hp<=0)
			{
				//プレイヤーを消去して，ゲームオーバー
				game.rootScene.removeChild(this);
				delete this;

				game.rootScene.addChild(lose);
			}
		});
		game.rootScene.addChild(player);//ゲームにプレイヤーを登録

		//プレイヤーの体力ゲージ
		var player_hp=new Sprite(320,20);//ゲージの大きさ
		var surface=new Surface(320,20);
		player_hp.image=surface;
		player_hp.surface=surface;

		//ゲージの表示場所
		player_hp.y=460;

		//プレイヤーの体力に合わせて体力ゲージの表示を変える
		player_hp.addEventListener("enterframe",function()
		{

			this.surface.context.fillStyle="#000000";//黒色
			this.surface.context.fillRect(0,0,320,20);//黒で塗りつぶす
			this.surface.context.fillStyle="#ff0000";//赤色
			this.surface.context.fillRect(0,0,320/20*player.hp,20);//体力の残ってる分だけ赤で塗る

		})
		//体力ゲージの登録
		game.rootScene.addChild(player_hp);



		//ここから敵キャラ
		var enemy=new Sprite(44,48);//敵の大きさ
		enemy.image=game.assets["enemy.png"];//敵に使う画像
		//敵の位置
		enemy.x=110;
		enemy.y=50;

		//敵の体力
		enemy.hp=1000;

		//敵の行動
		enemy.addEventListener("enterframe",function()
		{
				EnemyAction01(game,this);

				//体力がなくなったか確認
				if(this.hp<=0)
				{
					//体力が0になっていると敵を倒す
					game.rootScene.removeChild(this);
					delete this;

					//ゲームクリアの文字を表示
					game.rootScene.addChild(win);
				}
		});
		game.rootScene.addChild(enemy);//敵をゲームに追加

		//敵の体力ゲージ
		var enemy_hp=new Sprite(320,20);//ゲージの大きさ
		var surface=new Surface(320,20);
		enemy_hp.image=surface;
		enemy_hp.surface=surface;

		//ゲージの表示場所
		enemy_hp.y=0;

		//プレイヤーの体力に合わせて体力ゲージの表示を変える
		enemy_hp.addEventListener("enterframe",function()
		{

			this.surface.context.fillStyle="#000000";//黒色
			this.surface.context.fillRect(0,0,320,20);//黒で塗りつぶす
			this.surface.context.fillStyle="#0000ff";//青色
			this.surface.context.fillRect(0,0,320/1000*enemy.hp,20);//体力の残ってる分だけ青で塗る

		})
		//体力ゲージの登録
		game.rootScene.addChild(enemy_hp);


		//プレイヤーに敵の情報を教える
		player.enemy=enemy;

		//敵にプレイヤーの情報を教える
		enemy.player=player;


		//背景
		game.rootScene.backgroundColor="#000033";
	};
	game.start();//ゲームスタート

}

//プレイヤーの攻撃その1
//1秒間に15回，前に弾を発射する
function AddShot01(game,player)
{
	/* ここに入力4 */
	//これ
	if(player.age%60==0){//60フレームに1回発射
	//これ
		var shot=new Sprite(7,12);//弾の大きさ
		shot.image=game.assets["shot1.png"];//弾の画像

		//弾の発射位置
		shot.x=player.x+9;
		shot.y=player.y-15;

		shot.power=5;//攻撃力

		//弾の移動
		shot.addEventListener("enterframe",function()
		{
			this.y-=6;//弾を前に進める

			//画面からはみ出ると弾を消す
			if(this.y<20) game.rootScene.removeChild(this);
			delete this;

			//敵に当たると弾は消える
			if(this.within(player.enemy,15))
			{
				player.enemy.hp-=this.power;//敵の体力を減らす
				game.rootScene.removeChild(this);
				delete this;
			}

		});
		//ゲームに弾を登録する
		game.rootScene.addChild(shot);
	}
}

//プレイヤーの攻撃その2
//1秒間に10回3方向に弾を発射する
function AddShot02(game,player)
{
	if(player.age%5==0){//60秒間に1回発射
		for(var i=0;i<3;i++){//3つの弾を発射する
			var shot=new Sprite(7,12);//弾の大きさ
			shot.image=game.assets["shot2.png"];//弾の画像

			//弾の発射位置
			shot.x=player.x+9;
			shot.y=player.y-15;

			//弾の移動方向
			shot.vx=-1+i;
			shot.vy=-6;

			shot.power=7;//攻撃力

			shot.rotation=-10+10*i;//球を表示する角度を決める

			//弾の移動
			shot.addEventListener("enterframe",function()
			{
				this.y+=this.vy;//弾を前に進める
				this.x+=this.vx;//球を横方向に移動

				//画面からはみ出ると弾を消す
				if(this.y<20)game.rootScene.removeChild(this);
				delete this;


				//敵に当たると弾は消える
				if(this.within(player.enemy,15))
				{
					player.enemy.hp-=this.power;//敵の体力を減らす
					game.rootScene.removeChild(this);
					delete this;
				}
			});
			//ゲームに弾を登録する
			game.rootScene.addChild(shot);
		}
	}
}

//敵の行動その1
function EnemyAction01(game,enemy)
{
	if(enemy.age%(60/2)==0){//1秒間に2回のペースで発射
		for(i=0;i<12;i++){//12個の弾を発射
			var bullet=new Sprite(12,7);//弾の大きさ
			bullet.image=game.assets["bullet.png"];//弾に使う画像

			//弾の発射位置
			//敵の近くから発射
			bullet.x=enemy.x+14;
			bullet.y=enemy.y+30;

			//発射する弾の向きを決める
			/* ここを編集5 */
			//これ
			bullet.spd=1;//弾の速度
			//これ

			/* ここを編集6 */
			//これ
			bullet.angleRad= deg_to_rad(90);
			//これ
				//enemy.age * i;
				// 3.14/180*1.25*enemy.age+//弾を発射するたびに方向が変わる
				// 3.14/12*i;//12の弾を等間隔で

			//弾の軌道計算(気にしない)
			bulletSetFromAngleAndSpeed(bullet);

			//弾の移動
			bullet.addEventListener("enterframe",function()
			{
				//移動後の位置を計算
				this.x+=this.vx;
				this.y+=this.vy;

				//弾が画面外に出ているか調べる
				if(this.x<0 || this.x>320 || this.y<30 || this.y>450)
				{
					//弾が画面外に出ていたらゲームから消す
					game.rootScene.removeChild(this);
					delete this;
				}

				//プレイヤーに当たったか調べる
				if(this.within(enemy.player,10))
				{
					//当たっていると，プレイヤーのHPを減らし，弾を消去
					enemy.player.hp--;
					game.rootScene.removeChild(this);
					delete this;
				}

			});
			//ゲームに弾を登録する
			game.rootScene.addChild(bullet);
		}
	}
}

function deg_to_rad(deg){
	return 3.14/180*deg;
}


function EnemyAction02(game,enemy)
{
	for(i=0;i<3;i++){//12個の弾を発射
			var bullet=new Sprite(12,7);//弾の大きさ
			bullet.image=game.assets["bullet.png"];//弾に使う画像

			//弾の発射位置
			//敵の近くから発射
			bullet.x=enemy.x+14;
			bullet.y=enemy.y+30;

			//発射する弾の向きを決める
			bullet.angleRad=
				3.14/180*0.03*enemy.age*enemy.age+//弾を発射するたびに方向が変わる
				6.28/3*i;//12の弾を等間隔で

			bullet.spd=1;//弾の速度

			//弾の軌道計算(気にしない)
			bulletSetFromAngleAndSpeed(bullet);

			//弾の移動
			bullet.addEventListener("enterframe",function()
			{
				//移動後の位置を計算
				this.x+=this.vx;
				this.y+=this.vy;

				//弾が画面外に出ているか調べる
				if(this.x<0 || this.x>320 || this.y<30 || this.y>450)
				{
					//弾が画面外に出ていたらゲームから消す
					game.rootScene.removeChild(this);
					delete this;
				}

				//プレイヤーに当たったか調べる
				if(this.within(enemy.player,10))
				{
					//当たっていると，プレイヤーのHPを減らし，弾を消去
					enemy.player.hp--;
					game.rootScene.removeChild(this);
					delete this;
				}

			});
			//ゲームに弾を登録する
			game.rootScene.addChild(bullet);
		}
}

//気にしない
/*
弾の速度と角度から進む方向を計算する
*/
function bulletSetFromAngleAndSpeed(bullet)
{
	bullet.angleDeg=bullet.angleRad*180/3.14159265;
	bullet.vx=bullet.spd*Math.cos(bullet.angleRad);
	bullet.vy=bullet.spd*Math.sin(bullet.angleRad);
	bullet.rotation=bullet.angleDeg;
}
